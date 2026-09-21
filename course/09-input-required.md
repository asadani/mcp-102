# 09 · Input required

Modern MCP supports multi-round-trip results when a server needs additional
input. Use this for information required to continue, not for bypassing a
trusted approval surface.

Teamspace keeps publication approval in its host UI and binds it to an exact
operation fingerprint. MCP 103 adds a durable long-running job pattern and
explains how the optional Tasks extension can standardize its protocol-facing
lifecycle. The distinction is deliberate: protocol input, durable work, and
product authorization solve different problems.
