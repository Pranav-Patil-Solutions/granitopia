<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Build rule: loop-engineer every build

For every build or deliverable, use the loop-engineered-prompt method:

1. **Engineer ONE reusable prompt** (a brief/template) for the unit of work.
2. **Loop it over every item** — chapters, locales, cards, roles, images, sections — instead of hand-crafting each one-off. Keep the prompt in the code/comments so it's reproducible and swappable.
3. **Verify each looped output before wiring it in** (e.g. open every sourced image, check each locale renders, confirm each generated section builds).
4. Keep all parallel outputs in sync (all locales, all variants) and note anything skipped.

Example in this repo: the Journey chapter imagery in `src/components/three/storyChapters.ts` documents the single image brief that was looped across all five chapters.
