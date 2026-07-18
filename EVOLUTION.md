# EVOLUTION.md — permanent system deltas from build sessions

Per global rule INTEL-P1: every bug or agent misstep during a build ends as a
permanent system delta, logged here in the same session.

## 2026-07-18 · SPEC GRN-122 local merge (omega/task-1)

1. **Misstep:** the `code-reviewer` subagent ran `git checkout <branch> -- .`
   to inspect files, staging changes onto the caller's working tree mid-review
   (it self-reverted with `git reset --hard`).
   **Delta:** when spawning `code-reviewer`/`qa-runner`, the prompt must pin
   git to read-only commands (`log`, `diff`, `show`, `grep`) and forbid
   `checkout`/`reset`/`stash`; the caller re-verifies `git status --porcelain`
   after every review agent returns. (Applied in this session's prompts going
   forward; append to guardrails if it recurs.)

2. **Misstep:** `npm run start` was launched assuming the default port; the
   environment pins PORT=3333 (outside the repo config), which was occupied by
   an unrelated process, so the server died with EADDRINUSE.
   **Delta:** local smoke servers are always started with an explicit free
   port (`npx next start -p <port>` after an `lsof` check), never on the
   environment default.

3. **Repo bug found (pre-existing, not caused this session):**
   `tests/e2e/smoke.mjs:25` still waits on `locator('#slab')`, removed when
   SlabShowcase became StoneGallery (commit fe75847, 2026-07-05) — the smoke
   test has been silently broken since. Needs its selectors rewritten against
   StoneGallery; tracked for Pranav, out of GRN-122 scope.
