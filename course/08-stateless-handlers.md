# 08 · Stateless handlers

The modern handler factory creates an MCP server for each request. Identity,
protocol version and capabilities arrive with that request. Any replica can
process it. Persistent product state remains in PostgreSQL.

Stateless does **not** mean no database, no cache, no jobs, or no user state. It
means correctness does not depend on hidden connection-local MCP session state.
Restart the app and verify seeded/persisted data is still queryable.
