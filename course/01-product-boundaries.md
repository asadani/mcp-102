# 01 · Product boundaries

**Question:** where should MCP end and product code begin?

Run `npm run lab -- 01`. Alice and Eve receive different rows although the
search arguments contain no tenant ID. The validated identity supplies the
scope. Inspect `src/mcp.ts`, `src/api.ts` and `src/product.ts`: MCP translates a
capability call, the APIs authorize it, and the database persists it.

**Controlled failure:** adding `org` to the public schema lets a caller request
someone else's tenant. Do not add it. Verify with `npm test -- --test-name-pattern tenant`.

Labels: **MCP:** tool call shape. **Server policy:** downstream token exchange.
**Product:** tenant authorization and domain rules.
