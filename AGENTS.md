<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`npm run dev` serves the site on port 4317. Leave `DATABASE_URL`, `POSTGRES_URL`, and `BLOB_READ_WRITE_TOKEN` unset so local books stay in SQLite under `data/`. Demo login and the rest of the runbook are in `README.md`. Lint with `npm run lint`. There is no automated test script.
