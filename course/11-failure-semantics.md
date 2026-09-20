# 11 · Failure semantics

Run `npm run lab -- 11`. A stale write returns `CONFLICT`, not a generic 500.
`src/resilience.ts` retries only explicitly retryable failures and only for safe
operations within one deadline.

Distinguish timeout, dependency failure, protocol error, tool execution error,
empty result and uncertain mutation outcome. A request ID correlates JSON-RPC
messages; it is not an idempotency key.
