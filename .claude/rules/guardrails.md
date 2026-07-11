# Guardrails — never-do list (loads first)

- **master = prod.** Production (granitopia.vercel.app) ships from `master` via `vercel --prod`. Never push unverified work to master: `npm run build` must pass, smoke-test in a browser, preview deploy (`vercel`, no `--prod`) and Pranav's approval BEFORE promoting to production.
- **Slab imagery:** real client slab photos only — never reintroduce low-res stock thumbnails. OPEN: cosmopolitan / kimberly-pink / mahogany attribution — never ship those unattributed.
- **v1 ↔ v2 are file-synced:** shared files (AGENTS.md, this file, synced components) stay byte-identical across `granitopia` and `granitopia-v2`. If one side must diverge, say so explicitly and record it in the other repo.
- **Ship gate:** nothing ships until the `code-reviewer` then `qa-runner` subagents both return zero blockers on the final diff (findings-only returns — no full file bodies).

When the same mistake is corrected twice, append the fix here (mirror the change to the sibling repo).
