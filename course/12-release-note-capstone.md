# 12 · Release-note capstone

1. Start the API and UI.
2. Sign in as Alice and run **Prepare a release note**.
3. Inspect each trace layer and edit the draft.
4. Approve and publish the exact operation.
5. Confirm the new page appears in Knowledge.
6. Repeat as Viewer and confirm publication is rejected.
7. Switch to Sam and confirm Platform tasks/pages do not leak.

Acceptance: `npm test`, `npm run typecheck`, and `npm run build` pass. The
workflow needs no model key and the approval cannot be replayed or altered.
