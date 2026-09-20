# 06 · Two transports

`npm run dev` serves modern Streamable HTTP. `npm run stdio` serves the same
server factory over newline-delimited stdio. Protocol semantics and registered
capabilities stay the same; framing, process lifetime and authorization differ.

Never print application logs to stdout in stdio mode. HTTP validates bearer
identity per request. Stdio uses the explicitly configured local subject for
this lab; that convenience is not a remote identity system.
