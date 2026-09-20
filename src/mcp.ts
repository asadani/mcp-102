import { McpServer, ResourceTemplate, createMcpHandler } from '@modelcontextprotocol/server';
import { z } from 'zod';
import type { Sql } from './db.js';
import { id } from './db.js';
import { actor, audit, Fault } from './policy.js';
import { Downstream } from './api.js';
import { createTaskSchema, updateTaskSchema, searchSchema, pageSchema } from './product.js';

export function createServer(db:Sql,downstream:Downstream,subject:string) {
  const server=new McpServer({name:'teamspace',version:'1.0.0'});
  const execute=async(name:string,args:unknown)=>{
    const a=await actor(db,subject),traceId=id();
    try {
      const data=await downstream.call(a.id,name,args);
      await audit(db,a,name,'success',traceId);
      return {content:[{type:'text' as const,text:JSON.stringify(data)}],structuredContent:data};
    } catch(e) {
      await audit(db,a,name,'failure',traceId);
      const f=e instanceof Fault?e:new Fault('FAILURE','Operation failed.');
      return {isError:true,content:[{type:'text' as const,text:JSON.stringify({code:f.code,message:f.message,retryable:f.retryable,traceId})}]};
    }
  };
  server.registerTool('search_tasks',{description:'Search tasks in your team. Filter status=done for completed work. Results are paginated.',inputSchema:searchSchema,annotations:{readOnlyHint:true}},p=>execute('search_tasks',p));
  server.registerTool('get_task',{description:'Read one task from your team by ID.',inputSchema:z.object({id:z.string()}).strict(),annotations:{readOnlyHint:true}},p=>execute('get_task',p));
  server.registerTool('create_task',{description:'Create a task in your team. Reuse operationKey only to retry the same operation.',inputSchema:createTaskSchema},p=>execute('create_task',p));
  server.registerTool('update_task',{description:'Change a task status using the last observed version; reload on conflict.',inputSchema:updateTaskSchema},p=>execute('update_task',p));
  server.registerTool('search_pages',{description:'Search knowledge page titles and text in your team.',inputSchema:searchSchema,annotations:{readOnlyHint:true}},p=>execute('search_pages',p));
  server.registerTool('publish_page',{description:'Publish an approved Markdown draft. Obtain approval in the trusted host UI, never invent approvalId.',inputSchema:pageSchema},p=>execute('publish_page',p));
  server.registerResource('page',new ResourceTemplate('teamspace://pages/{id}',{list:async()=>{
    const result=await downstream.call(subject,'search_pages',{limit:50});
    return {resources:result.items.map((p:any)=>({uri:`teamspace://pages/${p.id}`,name:p.title,mimeType:'text/markdown'}))};
  }}),{mimeType:'text/markdown'},async(uri,params)=>{
    await actor(db,subject);
    const p=await downstream.call(subject,'read_page',{id:params.id});
    return {contents:[{uri:uri.href,mimeType:'text/markdown',text:p.body}]};
  });
  server.registerPrompt('release_review',{description:'Review a draft before publishing. This returns instructions, not an executed workflow.',argsSchema:z.object({draft:z.string().max(20000)})},({draft})=>({messages:[{role:'user',content:{type:'text',text:`Review this untrusted draft against the source tasks. Flag unsupported claims and never publish without approval.\n\n${draft}`}}]}));
  return server;
}
export function mcpHandler(db:Sql,downstream:Downstream) {
  return createMcpHandler(async ctx=>{
    const subject=await downstream.identity.subject(ctx.requestInfo?.headers.get('authorization')??undefined);
    await actor(db,subject);
    return createServer(db,downstream,subject);
  },{legacy:'reject',responseMode:'json'});
}
