# System architecture

## Purpose and scope

Thaddeus Campos / zyun.wav's seven-section personal portfolio serves prospective clients, collaborators, recruiters, and an academic evaluator. It connects marketing, audio engineering, and operations through a charcoal/emerald/coral editorial identity.

The implementation is a static React 18 + TypeScript + Vite application. **There is no HTTP API, backend, database, authentication, email delivery service, or analytics feed.** Architecture is implemented; verification and unresolved setup are recorded separately in `Progress.md`.

## Composition and ownership

```text
index.html + Vite metadata transform
  src/main.tsx (React StrictMode)
    App / MotionConfig
      ExperienceProvider (shared motion + audio state)
        Navigation (anchors + active-section tracking)
        main
          Home / About / Skills / Education
          Projects / Certificates / Contact
        Footer (motion control + academic disclosure)
```

| Boundary                           | Owner                                                        | Contract                                                                                        |
| ---------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Authored content and configuration | `src/data/portfolioData.ts`                                  | Personal facts, visible/accessibility copy, IDs, project/credential records, URLs, asset values |
| Page composition                   | `src/App.tsx`                                                | Seven ordered semantic sections, shared provider and landmarks                                  |
| Section behavior                   | `src/sections/`                                              | Local filtering, disclosures, modal selection, inquiry values/errors/draft                      |
| Shared experience                  | `src/hooks/Experience.tsx`                                   | Motion settings and one audio/demo state for all controls                                       |
| Wayfinding                         | `src/hooks/useActiveSection.ts`, `Navigation.tsx`            | Native anchors, scroll position, `aria-current`, mobile disclosure                              |
| Visual primitives                  | `src/components/`                                            | Custom SVG icons, portrait fallback, EQ, illustrative previews, bounded motion                  |
| Browser utilities                  | `src/lib/contact.ts`                                         | Validation, fixed-recipient mailto construction, clipboard and safe optional URLs               |
| Visual system                      | `src/styles.css`, `tailwind.config.js`                       | Tokens, layout, gradients/noise, focus, touch/reduced-motion behavior                           |
| Build metadata                     | `vite.config.ts`, `index.html`                               | HTML-escaped title/description derived from centralized data                                    |
| Deployment                         | `public/_redirects`, `public/_headers`, `public/favicon.svg` | Static Pages output, fallback rewrite and response-header configuration                         |

Do not move personal copy into rendering components. Avoid adding a router, network submission, or global-state framework without an architectural requirement and new ADR.

## Content data models

- `SectionId`: `home | about | skills | education | projects | certificates | contact`. `SectionInfo` maps stable IDs to labels, indices, eyebrows and titles. All section IDs and navigation records must agree.
- `Category`: `All | Marketing & SEO | Audio & Branding | Operations`. Each `Project` uses a non-All category, unique ID, output number, title, provenance/type, role, scope, activities and `PreviewKind`.
- `PreviewKind`: `audio | marketing | operations | copywriting`. The same preview component is reused in the hero dock and selected work.
- `Credential`: unique ID, exact title, short title, type, owner-provided summary and nullable image URL. A record is not proof its document was verified.
- `Inquiry`: name, email, subject and message strings. Validation errors are a partial field-to-message map. Subjects are allowlisted from central configuration.
- Metrics retain owner-supplied values, labels and year qualifiers. Illustrative chart points are under `previews.marketing`, never mixed with reported metrics.

The content object is checked with TypeScript `satisfies`. Contract tests check IDs, output counts, categories, credentials, chronology, demo disclosures and contact options.

## State and event flows

### Navigation

Anchor clicks update the hash and scroll to native section targets. CSS scroll margins account for the fixed navigation. A passive scroll handler schedules one animation-frame update and selects the last section above the activation threshold. Bottom-of-page behavior selects Contact. The mobile disclosure closes on selection or Escape; selection focuses the destination, Escape focuses its toggle.

### Experience / audio

`ExperienceProvider` exposes `motionOff`, `paused`, `reduced`, `toggleMotion`, `active`, `loading`, `audioMessage`, `hasAudio`, and `toggleAudio`.

With no `AUDIO_REEL_URL`, a click toggles a **silent visual demonstration**. With a safe configured URL, one hidden native audio element supplies playback. `play()` rejection, `playing`, `pause`, `ended`, and `error` events update shared state. No recording auto-plays; the visible waveform is decorative, not extracted analysis.

Reduced motion or the pause toggle marks the document `data-motion="off"`. CSS stops continuous effects; components disable travel/tilt. Pointer effects use spring motion values, not per-frame React state. Fine-pointer capability gates tilt.

### Projects / credentials

Filters derive visible records without mutating data. Buttons expose `aria-pressed`; a status announces the count. Native details elements provide further work/skill/timeline content.

Credential selection mounts a native `<dialog>`, opens it modally, focuses its close button, and restores the trigger when closed. An explicit Tab wrap keeps even the single-control empty-document state focused within the dialog. Escape and backdrop dismiss it. Missing/failed documents are explicit states rather than counterfeit previews. A supplied image is bounded within the modal.

### Inquiry / clipboard

1. Validate trimmed presence, length bounds, email structure, and allowed subject; focus the first invalid field.
2. Build a fixed-recipient URI for `bobitasstem@gmail.com`; encode subject/body query values. Include the visitor's name and email in the body, never as URI headers.
3. If the URI is at most 1,900 characters, request an email app through `mailto:`. Otherwise show the manual fallback only.
4. Retain all entered values and display the selectable/copyable draft. Explain that the visitor must send it and no website submission happened.
5. Clipboard feedback appears only after successful `navigator.clipboard.writeText`. Denial/unavailability offers selection/manual copying. A dismissible, polite live-region toast is fixed within the viewport so feedback remains visible on mobile; dismissing it restores the triggering control’s focus.

Inputs: name ≤100 characters (no CR/LF), email ≤254, message ≤5,000, listed subjects only. Form data exists only in component memory. No localStorage, cookie, network POST or durable draft storage. Browser mail-handler detection is intentionally not claimed.

## Asset and link configuration

Edit the exports at the top of `src/data/portfolioData.ts`:

```ts
export const PROFILE_IMAGE_URL: string | null = '/profile.webp';
export const CANVA_CERT_URL: string | null = '/certificates/canva.webp';
export const MUSIC_PORTFOLIO_URL: string | null = 'https://your-actual-portfolio.example';
export const AUDIO_REEL_URL: string | null = '/audio/reel.mp3';
```

These are example values to replace with real files/links, not existing resources. `PROFILE_PIC_URL` aliases the canonical profile export. Set individual credential `image` values for other scans. Put local files under `public/` and reference them from `/`; keep absent values `null`. No browser-upload service is present or implied.

External links accept HTTPS. Asset values accept HTTPS or root-relative paths (not protocol-relative URLs); backslashes and ASCII control characters are rejected to prevent URL-normalization surprises. Invalid values fall back to honest unavailable states. Profile images reserve dimensions and keep the monogram visible while loading; below-fold portraits are lazy-loaded. Missing assets are not requested. Optimize portrait/scans before adding them, preserve readability, and use an appropriately licensed audio reel.

## Visual and accessibility contracts

- CSS tokens retain the supplied charcoal, gunmetal, emerald, coral/amber, Alabaster and Pewter palette. The single chart series uses validated `#0EA574` on `#121715`; the brighter brand emerald remains in atmosphere/UI.
- The campaign plot has a labeled relative index, pointer crosshair, focusable inspection targets and a sample-data table. Its numerical data is visibly illustrative.
- All seven sections have headings and anchor links. Native landmarks, a skip link, visible focus, keyboard controls and minimum touch sizing support navigation.
- Reduced motion is honored for both decorative CSS and Framer Motion. Footer pause control is separate from audio playback. A silent demo never claims sound.
- Responsive breakpoints remove card angles and flank positioning before they can cause horizontal overflow. Mobile gets 16px side gutters and stacked work/dock layouts.
- Google Fonts load with preconnect and `display=swap`; system fallbacks remain usable when blocked. Fonts are an external network dependency.

## Build, tests and deployment

- Install: `npm ci --ignore-scripts` with the committed-ready lockfile. Verified on Node 20.20.0; supported lines are Node 20.20+ (20.x), Node 22.13+ (22.x), and Node 24+.
- Development: `npm run dev` (127.0.0.1, default Vite port 5173).
- Checks: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test -- --run`.
- Formatting: `npm run format`; the installed design skill and generated output are excluded.
- Production: `npm run build` → `dist`; `npm run preview -- --port 4173 --strictPort`.
- Browser tests: install Chromium with `npx playwright install chromium`, then `npm run test:e2e`. `playwright.config.ts` launches/reuses a local production preview. Artifacts stay in ignored test/report directories.
- Cloudflare Pages: build command `npm run build`, output directory `dist`, project-root build directory, supported Node runtime (22.x or 24.x recommended). `public/_redirects` is copied unchanged and contains `/* /index.html 200`. `public/_headers` declares nosniff, strict-origin-when-cross-origin referrer policy, frame denial, and disabled camera/microphone/geolocation permissions; actual response headers require deployed verification.

On Windows, stop this repository’s Vite dev/preview processes before `npm ci` so esbuild is not file-locked. Browser setup uses the Chromium revision matching the pinned Playwright version. If your environment provides `/run-skill-generator`, it can capture this verified launch/inspection workflow as a reusable project skill.

No Cloudflare account, deployment, Git initialization, or external publishing is included. Actual deployed routing/security settings must be verified after authorized deployment. Current dependency versions and any blocked fixes are documented in `Progress.md`; do not assume the original pins remain suitable forever.

## External contracts and privacy

Only static assets/fonts, configured media, and user-selected links need network access. Instagram/portfolio links open with `noopener noreferrer`. Mailto hands a visitor-approved draft to their email client. There is no API endpoint to test or provision and no secret that belongs in Vite environment variables.
