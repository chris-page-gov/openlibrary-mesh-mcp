# OpenLibrary Mesh + MCP (Open‑Source StepZen‑style Demo)

Wrap the public OpenLibrary REST search as **GraphQL** using **GraphQL Mesh**, then expose a single safe tool over **MCP** for AI assistants.

> This mirrors the StepZen workflow (curl → GraphQL → MCP) using **100% open‑source** components.

---

## What you get

- **GraphQL endpoint** at `http://localhost:4000/graphql` with a field:
  ```graphql
  searchBooks(title: String!, page: Int): {
    numFound, start, docs { title, author_name, first_publish_year, key }
  }
  ```
- **MCP server** exposing one tool: `open-library-search(title, page?)`

---

## Prerequisites

- Node.js **18.17+**
- Internet access (OpenLibrary is a public API)

---

## Quick start

```bash
# 1) Install deps
npm i

# 2) Start GraphQL Mesh (Terminal A)
npm run mesh:dev
# -> http://localhost:4000/graphql

# 3) Start MCP server (Terminal B)
npm run mcp:server
# (optional) change endpoint via env:
#   MESH_GRAPHQL=http://localhost:4000/graphql npm run mcp:server

# 4) (Optional) Run a smoke test (requires Mesh running)
npm test
```

Open GraphiQL at `http://localhost:4000/graphql` and run:

```graphql
query($title: String!, $page: Int) {
  searchBooks(title: $title, page: $page) {
    numFound
    start
    docs {
      title
      author_name
      first_publish_year
      key
    }
  }
}
```
**Variables**:
```json
{ "title": "the lord of the rings", "page": 1 }
```

---

## Using the MCP tool

Add the included `mcp/mcp.json` snippet to your MCP‑enabled client configuration. It declares a server named `openlibrary-mesh-mcp` that starts via:

```json
{
  "command": "node",
  "args": ["mcp/server.mjs"],
  "env": { "MESH_GRAPHQL": "http://localhost:4000/graphql" }
}
```

Your client should then list a tool named **`open-library-search`**. Call it with:
```json
{ "title": "the lord of the rings", "page": 1 }
```

---

## Project layout

```
openlibrary-mesh-mcp/
├─ package.json
├─ mesh.config.yml
├─ openlibrary.yaml
├─ src/
│  └─ search.mjs           # shared function used by MCP + tests
├─ mcp/
│  ├─ server.mjs           # minimal MCP server (stdio)
│  └─ mcp.json             # example client config
├─ test/
│  └─ test.mjs             # smoke test against Mesh endpoint
└─ .gitignore
```

---

## Notes & next steps

- **Schema shape**: expand `Doc` inside `openlibrary.yaml` with more fields (e.g., `subject`, `publisher`) and Mesh will expose them immediately.
- **Safety**: clamp arguments (e.g., `page`) and consider adding a transform to project only required fields.
- **Caching**: front Mesh with a simple cache or use Mesh plugins.
- **Auth**: OpenLibrary search is public. For authenticated APIs, add `operationHeaders` in `mesh.config.yml` and supply secrets via env.

---

## Licence

MIT for this example code; OpenLibrary API terms apply to the upstream data.