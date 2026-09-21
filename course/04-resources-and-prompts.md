# 04 · Resources and prompts

`teamspace://pages/{id}` exposes passive Markdown context. Listing resources
does not read their contents. `release_review` returns populated messages; it
does not execute a review or publish anything.

Use the UI workflow and inspect its `resources/read` trace. Change identity to
Sam: `page-1` must disappear because it belongs to Platform.

The template listing is deliberately bounded to the first fifty pages in this
small course product. Large catalogs should use the paginated `search_pages`
tool for discovery instead of treating `resources/list` as an exhaustive search.

Labels: **MCP:** resource/prompt operations. **Host:** decides what reaches the
model. **Product:** authorizes every read.
