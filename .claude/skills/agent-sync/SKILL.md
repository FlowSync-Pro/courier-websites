---
name: agent-sync
description: Coordinate with the other AI agents working on this repo (Claude on claude.ai, Cursor, Claude Code on the web, Claude Code on the owner's Mac, Grok). Use at the start of every task before editing anything, again right before every push, and whenever someone asks what the other agents are doing or who owns a file.
---

# Agent sync

Several AI agents work on this repo at the same time. Each one has its own job, its own branch prefix, and its own status file. This skill keeps you up to date with the others and stops you from overwriting their work.

## The pieces

- `.agents/roster.json` lists every agent: its id, job (`mission`), branch prefix, and the paths it `owns`. Paths under `shared` belong to nobody.
- `.agents/status/<id>.md` is each agent's status. Only that agent edits it. Others read it from that agent's latest branch, so it doesn't have to be merged first.
- `npm run agents:sync` fetches every branch and prints the team's status, any Asks addressed to you, open work on other branches, and a clash check of your own changes.

## Which agent are you?

| You are running in | Your id | Your branches |
| --- | --- | --- |
| claude.ai chat (coordinator) | `claude-chat` | `claude-chat/<topic>` |
| Cursor | `cursor` | `cursor/<topic>` |
| Claude Code on the web (claude.ai/code) | `claude-code-cloud` | `claude/<topic>`, or the branch the session assigns |
| Claude Code in Terminal on the owner's Mac | `claude-code-local` | `claude-local/<topic>` |
| Grok | `grok` | `grok/<topic>` |

The script works this out from your branch name. If it can't, pass `npm run agents:sync -- --agent <id>`.

## Before you edit anything

1. `git fetch origin`, then start a new branch from `origin/main` with your prefix. If you're continuing your own branch, merge `origin/main` into it first.
2. Run `npm run agents:sync` and read all of it.
3. Do the Asks addressed to you first, or say in your status why not.
4. Pick work inside the paths you own. If the task needs a file someone else owns, don't edit it. Add an Ask to its owner in your status and push that, then work on the rest.
5. To edit a shared or unassigned file, first check no one else lists it under Claims. Then add it to your Claims, commit, and push your status before you change the file. One agent per shared file at a time.
6. Update your status file (`updated`, `branch`, `state: active`, Working on, Claims) and push it early, so the others can see what you've started.

## Before every push

1. Run `npm run agents:sync` again. Fix every `!` line in the clash check:
   - A file owned by someone else: revert it and send its owner an Ask instead.
   - A file claimed by someone else, or also changed on another open branch: stop and coordinate through Asks. Don't race them to merge.
   - A shared file you haven't claimed: claim it, or revert it.
2. If you are behind main, merge `origin/main` and rerun the checks.
3. Run the repo's checks: `npm run lint` and `npm run build`.
4. Update your status file. Set `updated` to the current UTC time and move finished items to Done recently. Remove claims you're finished with, and add Asks for anything another agent needs to do.
5. Commit the status file together with your work, push your own branch, and open a PR to `main`. Never push to `main` or to another agent's branch.

## Status file format

Keep the field names and headings exactly as they are, because the sync script parses them.

```markdown
# <id> status

updated: 2026-10-21 23:10 UTC
branch: cursor/quote-form-copy
state: active | idle | blocked

## Working on
- One line per task.

## Claims
- `path/or/folder/` (why)

## Done recently
- What shipped, with the PR link.

## Next
- What you'll pick up next.

## Asks
- @claude-code-cloud: what you need from them and why.
- @all: something everyone has to do.

## Notes for everyone
- Facts the others need: URLs, decisions, gotchas.
```

When you finish an Ask, say so under Done recently, for example `- Done: @cursor's ask to add a hero photo (PR #12)`. The asker then removes the Ask from its own file.

## Rules

- Stay in your lane. Your job is the `mission` in the roster. If you find a bug in someone else's area, report it as an Ask with the file, what's wrong, and how to reproduce it. Don't fix it yourself.
- Only the coordinator (`claude-chat`) changes `.agents/roster.json`. If you want a change in lanes, send it an Ask.
- Never delete, force-push, or rewrite another agent's branch. Don't close another agent's PR.
- Keep PRs small and about one thing, so the owner can merge them quickly and the others pick up the changes sooner.
- The owner decides what merges. Agents don't merge their own PRs unless the owner says so.
