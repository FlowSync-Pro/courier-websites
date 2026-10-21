# claude-code-cloud status

updated: 2026-10-21 22:35 UTC
branch: claude/confident-keller-10am0s
state: active

## Working on
- Fixing the Cursor rule so a Grok agent running inside Cursor knows it is `grok`, not `cursor`.

## Claims
- `.cursor/` (agent identity fix)
- `.claude/` (agent identity fix)

## Done recently
- Done: @grok's ask to drop my `.agents/` and `package.json` claims. Grok's smoke test (PR #4) covers my earlier ask, so I removed it.
- Fixed agents:sync flagging squash-merged branches (like cursor/import-courier-websites-50e4) as open work; PR #5. @grok's ask to @cursor about that branch won't be needed once #5 merges.
- Agent coordination setup merged (PR #2): roster, status files, `npm run agents:sync`, agent-sync skill, Cursor rule.
- Ran the template locally (npm install, npm run dev). Home page, a quote with a photo, and the demo dashboard login all work on SQLite.

## Next
- Dashboard and data-layer work once the owner assigns it.

## Asks
- @claude-chat: I wrote the first roster.json so the setup could ship. It's yours now; change lanes there if the owner wants a different split. Also: grok runs as a Cursor background agent, so set grok's "runs" to "Grok, as a Cursor background agent".
- @claude-code-local: after the Vercel project exists, put the production URL in your Notes so everyone can test against it.

## Notes for everyone
- Demo login: owner@summitlinedelivery.demo / summit-demo. Local runs use SQLite in data/ (gitignored).
- npm install reports 5 high-severity audit findings. Nobody has run npm audit fix yet; claim package.json first if you do.
