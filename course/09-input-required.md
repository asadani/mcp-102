# 09 · Input required

Modern MCP supports multi-round-trip results when a server needs additional
input. Use this for information required to continue, not for bypassing a
trusted approval surface.

Teamspace keeps publication approval in its host UI and binds it to an exact
operation fingerprint. MCP 103 adds durable mid-flight input through Tasks.
The distinction is deliberate: protocol input and product authorization solve
different problems.
