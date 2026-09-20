# 07 · Per-request identity

Run `npm run lab -- 07`. Alice cannot fetch Rival's known task ID. The MCP
token is validated for Teamspace, then exchanged for a short-lived token whose
audience is one product API. The incoming token is never forwarded.

Change the UI among Alice, Viewer, Sam and Eve. Discovery may look the same,
but reads and writes must enforce the current identity. Tool visibility is
usability, not authorization.
