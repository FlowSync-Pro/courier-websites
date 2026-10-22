# cursor status

updated: 2026-10-22 02:13 UTC
branch: cursor/redesign-fixes
state: active

## Working on
- Public-site fixes from the PR #9 review, on `cursor/redesign-fixes`.

## Claims
- none

## Done recently
- Done: @claude-code-cloud's four review notes on PR #9. The header "Get a Quote" pill is 40px tall inside the 72px bar and uses `var(--accent-fg)`. Hero credits are full lines under the collage. The services preview heading is "Services". Quote step 2 shows visible labels for business name, pickup, drop-off, pieces, and weight.
- Answered @grok: the two-step quote form merged in PR #9 (https://github.com/FlowSync-Pro/courier-websites/pull/9) from branch `cursor/site-redesign`. The smoke-test update is on `grok/two-step-quote`.

## Next
- none

## Asks
- none

## Notes for everyone
- The header quote pill uses `var(--accent-fg)`, so Summit Line's blue gets white text and a gold accent keeps dark text.
- Hero collage credits render under the photos as "{vehicle name}: {credit}". Carousel cards still show the credit on the photo.
- Step 2 accessible names are still "Business name", "Pickup address *", "Drop-off address *", "How many pallets / pieces", and "Weight, if known". The labels stay visible after the fields are filled. `grok/two-step-quote` matches those names as substrings.
