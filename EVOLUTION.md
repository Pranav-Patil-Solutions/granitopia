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

## 2026-07-19 · SPEC GRN-122-SHIP-LOCAL (omega/task-2)

1. **Misstep (spec authoring):** the spec assumed branch
   `feat/grn-122-slab-photos` and mainline `main`; neither exists. The GRN-122
   work rode on `feat/grn-114-brand-logo-dark-mode` and was already integrated
   on `omega/task-1`; the mainline here is `master`.
   **Delta:** spec templates must quote branch names from actual
   `git branch -a` output at authoring time (never assumed), and must name this
   repo's mainline as `master` explicitly. A spec whose preflight assumptions
   fail is corrected in-report, not force-fit.

2. **Misstep (verification tooling):** the first render check asserted on
   `<img>` tags with literal `/images/stones/` srcs and found zero — this site
   serves slab photos via URL-encoded `next/image` requests, CSS backgrounds,
   and WebGL canvas textures. Second attempt asserted HTTP 200 only and
   false-failed on 304 cache hits.
   **Delta:** render verification on this repo asserts at the network layer
   (any response for `images/stones`, status < 400) after a full-page scroll,
   never on DOM `<img>` shape. Reusable script:
   scratchpad `grn122-slab-verify.mjs` pattern, kept alongside
   `tests/e2e/cursor-locale-smoke.mjs` conventions.

3. **Open finding (not a blocker for local merge, blocks prod push):**
   `kimberly-pink.jpg` (633×375, 46 KB) and `ivory-fantasy.jpg` (735×490) are
   thumbnail-grade among 74 high-res replacements, and `cosmopolitan` +
   `kimberly-pink` still ship unattributed (guardrails OPEN item; `mahogany`
   resolved by removal). Both need real photography/attribution before the
   push ticket.
