# 11 · Failure semantics

Run `npm run lab -- 11`. A stale write returns `CONFLICT`, not a generic 500.
`src/resilience.ts` retries only explicitly retryable failures and only for safe
operations within one deadline.

Distinguish timeout, dependency failure, protocol error, tool execution error,
empty result and uncertain mutation outcome. A request ID correlates JSON-RPC
messages; it is not an idempotency key.

Product writes, their idempotency claim and the stored result share one database
transaction. A crash before commit leaves none of them; a lost response after
commit is resolved by replaying the same operation key.
