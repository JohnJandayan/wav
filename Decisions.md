# Architecture decision records

These records preserve the reasons behind working boundaries. Read them before replacing a subsystem. Add a superseding ADR when a requirement changes; do not erase the previous rationale.

## ADR-001 — Static React dossier, not a routed application

**Status:** Accepted · 2026-11-08

**Context:** The portfolio needs seven clearly identified, smoothly navigable academic/professional sections. It has no authenticated content, server-managed records, or route-specific data.

**Decision:** React 18 + strict TypeScript + Vite compose a single long page. Native anchors own navigation; local React state owns disclosures, filters, and the inquiry draft. Cloudflare Pages serves `dist`.

**Alternatives:** A router, SSR framework, or backend would add dependencies and operational boundaries without supporting a current requirement.

**Consequences:** Anchor links remain meaningful and accessible. There is no HTTP API, session, database, or server secret. A future multi-page requirement must deliberately revisit this decision.

## ADR-002 — Explicit Tailwind 3 configuration and bespoke CSS

**Status:** Accepted · 2026-11-08

**Context:** The brief explicitly requests `tailwind.config.js`, a charcoal/emerald/coral horizon, and high-craft editorial typography rather than a template.

**Decision:** Retain Tailwind 3 with CSS-variable theme tokens and authored component CSS. Instrument Serif, Plus Jakarta Sans, and JetBrains Mono have separate roles. CSS radial/conic gradients and SVG noise create the atmosphere; no shader engine or UI kit is used.

**Alternatives:** Tailwind 4's different configuration model, generic component libraries, and GPU/canvas shaders.

**Consequences:** Configuration matches the requested deliverable. CSS composition is easier to maintain and lighter than a graphics runtime. Supporting sections intentionally vary in structure instead of repeating the hero's SaaS card treatment. Metadata text uses readable Pewter; technical grey is not relied on for essential small text.

## ADR-003 — One authored content/configuration source

**Status:** Accepted · 2026-11-08

**Context:** The owner must be able to change biography, asset URLs, certificates, and links without editing rendering code.

**Decision:** `src/data/portfolioData.ts` owns authored visible and accessible copy, navigation IDs, project/credential records, contact options, and optional assets. Type unions constrain section IDs and project categories. Vite's HTML transform derives metadata from the same content.

**Alternatives:** Embedded component copy, duplicated JSON metadata, or a CMS.

**Consequences:** Content changes are inspectable in one file and typechecked. Rendering helpers may derive display strings/indices but must not invent personal facts. A future CMS must preserve these contracts and provenance distinctions.

## ADR-004 — Truthful asset and evidence boundaries

**Status:** Accepted · 2026-11-08

**Context:** The owner supplied career descriptions but no photo, certificate scans, audio recording, portfolio URL, campaign analytics, or stock records.

**Decision:** Optional assets are `null` until supplied. A custom monogram and an explicitly unavailable-document view are designed final states. Marketing samples say “Illustrative”; operations previews show workflow, not government records. Owner-reported metrics and credential claims are separate from independently inspected evidence. Without a music portfolio URL, the CTA accurately opens the supplied Instagram profile.

**Alternatives:** Stock photos, manufactured certificates, invented campaign metrics, fake audio playback, and dead links were rejected.

**Consequences:** The site is functional without missing files, but academic grading and factual verification still depend on owner-provided source evidence. Overlapping supplied education dates remain unchanged and are tracked in `Progress.md`.

## ADR-005 — Shared audio state; bounded and optional motion

**Status:** Accepted · 2026-11-08

**Context:** Navbar, hero, and audio work previews must agree on whether the signal is playing. Continuous decorative motion must be accessible.

**Decision:** `ExperienceProvider` owns user motion preference and shared audio/demo state. An absent audio source runs a clearly labeled silent visual demonstration. A configured source uses a user-initiated audio element with loading, rejection, error, pause, and ended states. Waveforms remain decorative rather than claiming spectral analysis. Framer Motion supplies bounded springs; CSS supplies the eight-second horizon pulse.

**Alternatives:** Per-control audio instances, autoplay, Web Audio analysis without a supplied reel, and per-frame React pointer-state updates.

**Consequences:** Controls stay synchronized. Reduced motion and a pause control stop looping effects; pointer tilt is disabled for coarse pointers. Audio does not start without a visitor action. Changing audio state semantics requires updating component tests and the system contract.

## ADR-006 — Open an email draft, do not send inquiries

**Status:** Accepted · 2026-11-08 · Explicit user selection

**Context:** The owner selected an email-draft workflow instead of server-side email delivery.

**Decision:** Validate bounded name/email/message inputs and an allowlisted subject. Construct a fixed-recipient, encoded `mailto:` URI. Preserve form values and provide a copy/selectable draft fallback. For a URI over 1,900 characters, skip unreliable link launching and show the manual fallback. Never display a “sent” confirmation.

**Alternatives:** Cloudflare Pages Functions plus an email provider were offered and not selected.

**Consequences:** No API keys, backend, personal-data storage, or submission request. Actual delivery requires the visitor's email app. The browser cannot reliably determine whether a mail handler opened; the UI explains this rather than claiming it succeeded. Clipboard denial receives selectable text, not false success.

## ADR-007 — Cloudflare Pages deployment contract

**Status:** Accepted · 2026-11-08

**Decision:** Build with `npm run build`; deploy `dist`; use a supported Node runtime. Copy `public/_redirects` containing `/* /index.html 200` into output. `public/_headers` adds basic static-response hardening without a restrictive CSP that would break configurable external media/fonts. Keep resource URLs root-relative for static hosting.

**Consequences:** The redirect supports fallback navigation, though the current site uses anchors. Local Vite preview checks do not prove Cloudflare deployment behavior. Deployment requires owner authorization and remains separate from implementation.

## ADR-008 — Layered verification and maintained handover

**Status:** Accepted · 2026-11-08

**Decision:** TypeScript + zero-warning ESLint + production build establish code checks. Vitest/Testing Library test pure contracts and interactions; Playwright/axe and screenshot inspection cover responsive browser behavior. Root `AGENTS.md` is the canonical entry; `CLAUDE.md` imports it. Progress, system, and decision documentation change alongside implementation.

**Consequences:** Passing automated accessibility checks is not equivalent to a complete manual audit. Record exact checks performed and failures. Browser tests use production preview; no email is actually sent. Documentation upkeep is an explicit coding-agent workflow, not a filesystem automation claim.

## ADR-009 — Patched, pinned development dependencies

**Status:** Accepted · 2026-11-08

**Context:** The initial Framer Motion pin resolved incompatible transitive packages and prevented builds. The initial audit also reported development-tool advisories. Updating ESLint and its plugins together required upgrading the plugins first to satisfy peer constraints.

**Decision:** Pin the verified compatible Motion/tooling versions and retain the npm lockfile. Use Framer Motion 14.10.1 with React 18, Vitest 4.1.12, PostCSS 8.5.32, ESLint 10.14.0 and TypeScript ESLint 8.72.1. Override minimatch to 11.0.5 because the installed lint-tool dependencies otherwise resolve the advisory-affected 10.x release. Add Prettier for readable, consistent source formatting. Dependencies were installed with lifecycle scripts disabled.

**Alternatives:** Ignoring audit results, forcing an incorrect peer resolution, or downgrading entire tools to avoid one transitive advisory.

**Consequences:** The dependency audit currently reports zero vulnerabilities and the lint/type/build/test checks pass with the override. The override affects current lint-tool consumers only; reassess it when upgrading or adding dependencies and remove it once upstream constraints adopt a patched version. Re-run all checks after lockfile changes. This is a dated audit result, not a permanent security guarantee.
