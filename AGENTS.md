# Repository Guidelines

## Project Structure & Module Organization

- `src/`: JavaScript/Node.js source code (GraphQL Mesh wrapper, search logic).
- `mcp/`: MCP server and configuration (`server.mjs`, `mcp.json`).
- `test/`: Test suite (`test.mjs`).
- `docs/`: Documentation and instructions.
- Root configs: `mesh.config.yml`, `openlibrary.yaml`, `package.json`.

## Build, Test, and Development Commands

- Install dependencies: `npm install`
- For any Python package management after the initial devcontainer build, use `uv` (preferred) instead of `pip`.
- Start GraphQL Mesh: `npm run mesh:dev`
- Start MCP server: `npm run mcp:server`
- Run tests: `npm test`

## Coding Style & Naming Conventions

- Node.js 18+, ES modules (`.mjs`), 2-space indent, LF endings; max line length 100.
- Use `cross-fetch` for HTTP requests.
- Naming: modules and functions `camelCase`, constants `UPPER_SNAKE_CASE`.
- Source code lives under `src/`.

## Testing Guidelines

- Framework: Node.js built-in `assert` for tests.
- Name tests clearly; prefer small, deterministic unit tests.
- Keep/raise coverage when changing behavior; add tests for regressions.

## Commit & Pull Request Guidelines

- Follow Conventional Commits: `type(scope): subject`.
  Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci.
- PRs: include clear description, linked issues, and before/after notes. For API/tool changes, show example command/output.
- Run tests locally before opening a PR.

## Docs & Changelog Sync

- Always update documentation for user-visible changes: new commands, API/tool changes, or config updates.
- Keep docs current when code changes:
  - `README.md`: quick start, usage examples, new commands.
  - `COPILOT-INSTRUCTIONS.md`: agent and AI assistant guidelines.
- Do not bump version; maintainers will cut releases. Leave changes under [Unreleased] when using a changelog.

## Security & Configuration Tips

- Do not commit secrets or local environment files; `.env*` is gitignored.
- When changing endpoints, prefer environment variables (see `.env.example`).
- Use a devcontainer based on standard VS Code devcontainer images, with required features and environment variables read from the host (prefer this over .env files).
- For Python, use `uv` for package management after the initial build (which may use `pip` for simplicity).
- Large data or logs should be gitignored.

## Agent-Specific Notes

- Make minimal, focused changes; do not rename files or APIs without discussion.
- Obey these guidelines for any files you touch and update docs/tests alongside code changes.