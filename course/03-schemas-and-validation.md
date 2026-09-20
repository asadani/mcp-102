# 03 · Schemas and validation

Run `npm run lab -- 03`. The search contract bounds query length, offset and
page size. Defaults improve ergonomics; server validation remains mandatory
because descriptions are prose, not enforcement.

Compare three failures: malformed `tools/call` is a JSON-RPC protocol error;
invalid tool arguments are a tool execution error; a valid search with no rows
is a successful empty result. A host must not collapse these states.
