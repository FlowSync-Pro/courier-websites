<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Working alongside other agents

Several AI agents work on this repo at once: Claude on claude.ai (coordinator), Cursor (public website), Claude Code on the web (dashboard and data), Claude Code on the owner's Mac (deploys and QA), and Grok (tests and review). Each has its own job, its own branch prefix, and its own status file. The list is in `.agents/roster.json`.

Before you edit anything and again before every push, follow `.claude/skills/agent-sync/SKILL.md`. In short:

1. Work on your own branch (`<your prefix>/<topic>`, cut from `origin/main`). Never push to `main` or to another agent's branch.
2. Run `npm run agents:sync`. Do the Asks addressed to you, and fix every `!` line in its clash check.
3. Only edit paths you own. For anything else, add an Ask to the owner in `.agents/status/<your id>.md`. Claim shared files there before you touch them.
4. Update your status file, commit it with your work, push, and open a PR to `main`.
