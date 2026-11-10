# Agent entry instructions

This repository is Thaddeus Campos / zyun.wav's personal portfolio: a seven-section academic and professional dossier, not a SaaS product.

## Read first

1. `Progress.md` — actual state, verification evidence, unresolved work.
2. `System.md` — boundaries, contracts, and asset configuration.
3. `Decisions.md` — why the architecture is shaped this way.
4. `.agents/skills/frontend-design/SKILL.md` — installed design guidance; the explicit client brief takes precedence.

## Working agreements

- Use strict React + TypeScript + Vite, Tailwind 3, and Framer Motion. Keep this a static anchor-navigated site unless a new requirement justifies an ADR.
- All authored visible copy, accessible messages, metrics, links, and asset configuration belong in `src/data/portfolioData.ts`. Do not scatter personal facts across components.
- Preserve all seven sections and the four owner-described outputs. Do not invent metrics, testimonials, credential scans, recordings, campaign results, or government inventory records.
- Missing assets are explicit, designed states. Illustrative visualizations must say they are illustrative. The contact form opens an email draft; it does not send anything.
- Preserve responsive layouts, visible focus, semantic controls, reduced-motion support, and the pause-motion control. Keep pointer effects bounded and off for coarse pointers/reduced motion.
- Never add secrets to the frontend. There is no backend/API in the current architecture.
- Do not rewrite a working boundary merely for stylistic preference. Consult the ADR and document a justified superseding decision first.
- Do not deploy, publish, initialize Git, or commit without a user request.

## Commands

`npm ci --ignore-scripts` (verified lockfile install), `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test -- --run`, `npm run build`, `npm run preview`, `npm run test:e2e`. Use `npm run format` to format authored files; `.prettierignore` preserves the installed skill.
For first-time browser testing: `npx playwright install chromium`. Tests run against a local production preview.
Use Node 20.20+ in the 20.x line, Node 22.13+ in the 22.x line, or Node 24+. Stop this repository’s running Vite servers before reinstalling dependencies on Windows; otherwise the esbuild executable may be file-locked. Never stop unrelated project processes.

## Completion and documentation upkeep

In the same change, update `Progress.md` when implementation state, verification, priorities, or known bugs change. Update `System.md` for boundary/data/browser contract changes and `Decisions.md` for architectural choices; update this file for new workflows/invariants. Supersede ADRs rather than deleting their rationale. Record tests actually run, with failures and skipped checks. These are agent-maintained documents, not an automatic filesystem watcher.
