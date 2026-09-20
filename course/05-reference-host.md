# 05 · Reference host

The host in `src/host.ts` lists tools, uses a deterministic selection fixture,
calls `search_tasks`, reads a resource, and constructs a draft. No model key is
needed and no fake claim of model reasoning is made.

Run the workflow in the UI. The trace must distinguish `model`, `mcp`, and
`host`. Approval belongs to the trusted host UI; a model-generated
`approvalId` is never accepted.
