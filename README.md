# MCP 102 · Build the integration

MCP 102 is a runnable course. It builds **Teamspace**, a small task tracker and
Markdown knowledge system, and exposes both through one MCP server. The point is
to see each boundary: model, host, MCP, authorization and product API.

The main path targets MCP `2026-07-28` and `@modelcontextprotocol/*` v2. The
course requires Node 22+. No model key or cloud account is required.

## Interactive tutorial

Read the hosted course at **[tech.anujsadani.in/mcp-102](https://tech.anujsadani.in/mcp-102/)**. The repository root is the tutorial page, a single self-contained `index.html` in the same format as MCP 101 (no build step; every JSON-RPC frame on it was captured from this repository’s running server, and every code excerpt is pulled from `src/`); the runnable Teamspace product remains available locally at `http://127.0.0.1:5173/app.html`.

Every chapter can also be listened to: about 29 minutes of narration in a synthetic voice (Kokoro-82M), one track per chapter. Press *Listen straight through* on the page. The scripts are in `narration/` and `tools/README.md` explains how the audio is made.

## Run it

```powershell
npm install
npm run dev       # API + MCP at http://127.0.0.1:3102
npm run ui        # tutorial at /, product UI at /app.html
```

Use `alice`, `bob`, `viewer`, `sam`, and `eve` in the identity switcher. These
are deliberately labelled development identities, issued by the local teaching
provider. They are not a production authentication system.

```powershell
npm test
npm run typecheck
npm run build
npm run lab -- 01
```

`npm run stdio` exposes the same tool/resource/prompt factory over stdio and
uses `TEAMSPACE_SUBJECT=alice` by default.

## Architecture

```text
reference host ── JSON-RPC/MCP ── Teamspace MCP
                                      │
                               short-lived audience tokens
                                 ┌────┴────┐
                              Tasks API  Knowledge API
                                 └────┬────┘
                                   PostgreSQL
```

The two product APIs listen on ephemeral loopback ports. The MCP layer never
queries product tables directly. It exchanges the incoming identity for a
short-lived token scoped to the downstream API; it never forwards an MCP bearer
token. PGlite supplies embedded PostgreSQL for the default labs. Set
`DATABASE_URL=postgres://...` to use normal PostgreSQL.

## Course map

The twelve checkpoints are in [`course/`](course). Each names a controlled
failure, the implementation to inspect, and a verification command. Start with
`01-product-boundaries.md` and finish with the release-note capstone.

MCP requirements, host behavior, server policy and product responsibility are
labelled separately. This prevents a common category error: assuming that tool
discovery implements authorization, approval, retries or business rules.

## Security model

- Every product query includes organization and team scope from validated
  identity. Caller-supplied tenant identifiers are not accepted.
- Role permissions and plan entitlements are separate decisions.
- Tool visibility is usability; every invocation still authorizes execution.
- Writes accept an operation key and version. Approval is short-lived,
  actor-bound and bound to the exact operation fingerprint.
- Audit records contain actor, tenant, operation, outcome and trace ID; they do
  not contain access tokens, arguments, page bodies or scraped content.

See [`PRODUCT.md`](PRODUCT.md), [`DESIGN.md`](DESIGN.md), and
[`UX-CONTRACT.md`](UX-CONTRACT.md) for maintained product decisions.

## Compatibility

| Component | Tested line | Notes |
|---|---:|---|
| MCP specification | 2026-07-28 | Stateless per-request metadata |
| MCP TypeScript SDK | 2.0.0 | Split server/client packages |
| Node.js | 22, 24, 26 | Node 20 is the SDK floor |
| PostgreSQL | embedded / 16+ | Same SQL and constraints |

Older clients that require the `initialize` handshake are intentionally rejected
by the HTTP endpoint. The stdio entry can serve both eras through the SDK shim;
that compatibility path is identified as legacy in the lesson.

Protocol-sensitive lessons are checked against the MCP
[`2026-07-28` release notes](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
and the [TypeScript SDK v2 protocol guide](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions).

## Operational notes

- **`GET /healthz`** answers 200 after a `SELECT 1`, or 503 if the database is unreachable. It needs no token, so a container or load-balancer health check can use it.
- **`/mcp` challenges instead of failing.** A missing, invalid, expired or wrong-audience token gets `401` with `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource"`. The check (`requireToken` in `src/auth.ts`) runs in Express *before* the MCP handler: an error thrown inside the handler factory is reported by the SDK as a 500, which would hide the challenge from the client.
- **Demo data is development-only.** Members and tasks are seeded unless `NODE_ENV=production`; set `SEED_DEMO_DATA=1` to opt in deliberately.
- **Writes and operation results commit atomically.** `once()` runs the idempotency claim, product write and stored result in one database transaction. A crash before commit rolls everything back; a lost response after commit is replayed by the same key.
- **The MCP token is resource-bound.** Its audience is the advertised resource URL (`<origin>/mcp`). Product API calls receive separate short-lived tokens for their own audience.
- **Operational rows have retention.** A background maintenance sweep expires approvals and removes old operation, audit, rate, reservation and terminal-job rows.
- **A refused resource read is a structured not-found.** `resources/read` for a page that is missing, in another team or in another organisation answers with the SDK’s `ResourceNotFoundError` (JSON-RPC `-32602`, with the URI in `data`), never a bare internal error.
- **The circuit breaker guards the product APIs.** `Downstream` keeps one breaker per API. It counts only outages (unreachable, 5xx, blown deadlines), never a definite refusal such as `NOT_FOUND`.
- **Production needs its settings.** With `NODE_ENV=production` the server refuses to start unless `DATABASE_URL`, `TOKEN_SECRET` and `PUBLIC_ORIGIN` are set.
