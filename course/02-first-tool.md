# 02 · First tool

Run `npm run lab -- 02`, then inspect `create_task` in `src/mcp.ts`. Its method
on the wire is `tools/call`; `create_task` is `params.name`. The handler calls a
product API instead of owning task storage.

**Controlled failure:** send a title containing only spaces. Schema validation
must produce an actionable tool error and create no row. Then retry a successful
call with the same operation key and observe one task, not two.

Labels: **MCP:** discovery and invocation. **Product:** creation semantics.
