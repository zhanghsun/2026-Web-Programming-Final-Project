# Campus Nature Explorer
**國立中央大學 生態與保育資訊網**

A multi-page educational website built for National Central University's campus ecology and conservation program. Developed as a Web Programming course project.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Content Management Design](#content-management-design)
6. [Feature Implementation](#feature-implementation)
7. [Routing Architecture](#routing-architecture)
8. [Responsive Design Strategy](#responsive-design-strategy)
9. [UI/UX Design Decisions](#uiux-design-decisions)
10. [Installation & Local Development](#installation--local-development)
11. [Build and Deployment](#build-and-deployment)
12. [Future Technical Improvements](#future-technical-improvements)
13. [Contributors](#contributors)
14. [Conclusion](#conclusion)

---

## Project Overview

Campus Nature Explorer is a zero-dependency, static multi-page website that catalogues 17 wildlife species and 10 plant species found on the NCU campus. The site integrates an interactive ecology map, a 5-chapter decision-based game engine, and a Google Sheets–backed participation form.

The project was built without any front-end framework. All interactivity is implemented in vanilla JavaScript using module-per-feature organisation, demonstrating core web fundamentals: DOM manipulation, the Fetch API, Intersection Observer, sessionStorage, and CSS custom properties.

**Scale:** ~4,500 lines of JavaScript across 17 modules, ~3,200 lines of CSS across 18 stylesheets, 17 HTML pages (including sub-pages), and 51+ image assets.

---

## Technology Stack

### HTML5 (Semantic Markup)
All pages use semantic HTML5 elements (`<article>`, `<section>`, `<nav>`, `<figure>`). Sub-pages under `pages/` use `<base href="../">` to resolve all asset paths relative to the project root, eliminating duplicated path logic across every sub-page.

### Vanilla CSS3 (No Framework)
All styling is hand-authored CSS3. CSS custom properties (`--var`) are used throughout `shared.css` for theming. Layout is achieved with CSS Grid and Flexbox. No preprocessor (Sass/Less) or utility-class framework (Tailwind) is used — this was a deliberate choice to demonstrate mastery of the cascade and specificity without abstraction.

Key CSS techniques used:
- `@keyframes` for the SVG score ring `stroke-dashoffset` animation on the results page
- `backdrop-filter: blur()` for glassmorphism panels (map side panel, navbar)
- `clip-path` and `radial-gradient` for the hero spotlight and card glow effects
- `Intersection Observer`-driven `.scroll-reveal` class toggling (no scroll-listener polling)

### Vanilla JavaScript (ES6+, IIFE Modules)
No bundler, no transpiler. Each JS file is either an IIFE (`(function(){ 'use strict'; ... })()`) or a plain function exposed on `window`. This sidesteps ES module `import`/`export` while still preventing global scope pollution for the more complex modules.

Module loading order is managed explicitly through `<script>` tag ordering in each HTML file. Data-providing scripts (`species-data.js`, `ecosystem-game-data.js`) are loaded before the scripts that consume them, enforcing a simple dependency contract.

### Markdown (Content Authoring)
Plant detail content is authored in `.md` files under `data/plants/`. The `plant-detail.js` module fetches the file via the Fetch API and parses Markdown tables, headings, and lists with custom regex-based parser functions — no external Markdown library is used. This separates content from presentation without introducing a build step.

### Google Sheets API (Form Backend)
The participation form in `form.js` submits to a Google Apps Script web app endpoint via `fetch()` with a `FormData` payload. This provides a serverless, zero-cost backend for collecting user submissions without requiring any server infrastructure.

### Intersection Observer API (Scroll Animations)
`animations.js` registers an `IntersectionObserver` for all `.scroll-reveal` elements. When 10% of an element enters the viewport, the `reveal` CSS class is added. The observer then `unobserve()`s the element immediately, preventing redundant callback invocations on scroll-back.

---

## System Architecture

The site uses two distinct navigation patterns depending on context:

```
┌──────────────────────────────────────────────────────────────┐
│                         index.html                           │
│  ┌───────────┐  ┌────────────────┐  ┌──────────────────────┐ │
│  │ #home-page│  │ #resources-page│  │    #join-page        │ │
│  │  (active  │  │  (hidden div)  │  │    (hidden div)      │ │
│  │   by CSS) │  │                │  │                      │ │
│  └───────────┘  └────────────────┘  └──────────────────────┘ │
│       ↑                 ↑                      ↑             │
│       └────────── navigation.js (showPage) ───┘             │
│              [data-page] attribute binding                   │
└──────────────────────────────────────────────────────────────┘
         │ location.href                │ location.href
         ▼                              ▼
  pages/animals.html           pages/ecosystem-guardian.html
  pages/plants.html                     │
  pages/wildlife-map.html               ▼
  pages/species.html           pages/ecosystem-game.html
  pages/plant-detail.html               │ sessionStorage: eg_results
                                        ▼
                               pages/ecosystem-results.html
```

**Pattern A — SPA simulation (index.html):**
`index.html` contains three page `<div>` elements (`#home-page`, `#resources-page`, `#join-page`). Only one is visible at a time via `.active` class toggling. `navigation.js` exposes `showPage(id)` globally. All `[data-page]` elements in the DOM are bound to this function on `DOMContentLoaded`. This avoids full-page reloads for the three primary sections.

**Pattern B — Multi-page navigation (pages/):**
Feature-heavy pages (`animals.html`, `plants.html`, `ecosystem-game.html`, etc.) are separate HTML files. They use `<base href="../">` so all relative asset URLs (`js/`, `css/`, `assets/`) resolve from the project root regardless of physical file location.

**State propagation between pages:**
The game engine writes results to `sessionStorage` under the key `eg_results` as a serialised JSON object. The results page reads this key on load. If the key is absent (direct URL access without playing), a static demo dataset is rendered. This avoids URL query string clutter and keeps game state scoped to the browser tab session.

---

## Project Structure

```
NCU_WebsiteDesign_/
│
├── index.html                   # SPA shell: home, resources, join pages
│
├── pages/                       # Full-page sub-routes
│   ├── animals.html             # Wildlife explorer grid
│   ├── species.html             # Individual species detail (query-param driven)
│   ├── plants.html              # Plant explorer card grid
│   ├── plant-detail.html        # Individual plant detail (query-param driven)
│   ├── wildlife-map.html        # Full-screen interactive campus map
│   ├── ecosystem-guardian.html  # Game briefing / challenge mission base
│   ├── ecosystem-game.html      # 5-chapter decision game engine
│   └── ecosystem-results.html   # Guardian score + decision timeline
│
├── js/                          # One file per feature module
│   ├── species-data.js          # Global data store: 17 species (window.speciesData)
│   ├── ecosystem-game-data.js   # Global data store: 5 scenarios (window.GAME_SCENARIOS)
│   ├── navigation.js            # SPA page switching, role switching
│   ├── modal.js                 # Map side-panel population (displayInfo)
│   ├── map.js                   # Map modal, spot interaction, pin state
│   ├── animals.js               # Species grid, filter tabs, drawer open/close
│   ├── species-page.js          # Species detail page (URL param: ?species=key)
│   ├── plants.js                # Plant card grid, floating leaf particle effect
│   ├── plant-images.js          # Image probe loader (PlantImages API)
│   ├── plant-detail.js          # MD fetch + parser, 10-section layout builder
│   ├── ecosystem-guardian.js    # Challenge card interactions
│   ├── ecosystem-game.js        # Game engine: state machine, health bar, chapters
│   ├── ecosystem-results.js     # Results renderer: tier classification, timeline
│   ├── resources.js             # Resource card click → external page routing
│   ├── form.js                  # Google Sheets form submission
│   ├── animations.js            # Intersection Observer scroll-reveal
│   ├── mouse-spotlight.js       # Radial gradient cursor spotlight effect
│   └── main.js                  # App entry point: init orchestration, load overlay
│
├── css/                         # Stylesheet per feature / component
│   ├── shared.css               # CSS custom properties, resets, typography
│   ├── navbar.css
│   ├── hero.css
│   ├── home-sections.css
│   ├── cards.css
│   ├── explore-cards.css
│   ├── map.css
│   ├── resources.css
│   ├── forms.css
│   ├── animations.css
│   ├── mouse-spotlight.css
│   ├── animals.css
│   ├── species.css
│   ├── plants.css
│   ├── plant-detail.css
│   ├── ecosystem-game.css
│   ├── ecosystem-guardian.css
│   └── ecosystem-results.css
│
├── data/
│   ├── plants/                  # 10 × .md files (one per plant species)
│   └── species/                 # 17 × .md files (one per wildlife species)
│
└── assets/
    ├── icons/
    └── images/
        ├── background/          # 10 scenario background images
        ├── plants/              # 10 folders × 3 images each
        └── species/             # 17 folders × 3 images each
```

**Module responsibilities:**

| Module | Responsibility |
|--------|----------------|
| `species-data.js` | Single source of truth for all 17 species. Exposes `window.speciesData`. Consumed by `modal.js`, `animals.js`, `map.js`, and `ecosystem-results.js`. |
| `ecosystem-game-data.js` | 5 game scenario definitions including choices, health deltas, and feedback text. Must be loaded before `ecosystem-game.js`. |
| `navigation.js` | `showPage(id)` — activates one `.page` div, deactivates all others. Also handles role-based resource centre switching. |
| `plant-images.js` | Probes candidate image URLs with `new Image()` before injecting them, preventing broken `<img>` elements when images are absent. |
| `main.js` | Orchestrates module initialisation order. Calls `init*()` functions only if they exist (graceful no-op if a module is not loaded on a given page). |

---

## Content Management Design

### Markdown-Based Plant Content

Each of the 10 plant species has a dedicated `.md` file in `data/plants/`. The file is fetched at runtime by `plant-detail.js`:

```js
fetch(`data/plants/${plantName}.md`)
  .then(r => r.text())
  .then(md => parseAndRender(md));
```

`plant-detail.js` contains custom parsing functions for:
- **Markdown tables** → parsed into `string[][]` row arrays via regex on `|`-delimited lines
- **Section headings** (`## heading`) → mapped to named section `<div>` elements
- **Bullet lists** → converted to `<ul><li>` structures

Adding a new plant requires only:
1. Creating `data/plants/新植物.md` following the standard section schema
2. Adding `assets/images/plants/新植物/新植物1.jpg`, `新植物2.jpg`, `新植物3.jpg`

No JavaScript changes are needed. `plant-images.js` discovers images dynamically by probing the naming convention.

### Species Data Organisation

Wildlife data lives in `js/species-data.js` as a JavaScript object (`window.speciesData`). Each entry follows a strict schema:

```js
squirrel: {
  name:           '赤腹松鼠',
  englishName:    "Pallas's Squirrel",
  category:       'animal',      // 'animal' | 'plant'
  group:          'ground',      // filter group key
  characterTitle: '樹梢跑酷大師',
  avatar:         'assets/images/赤腹松鼠.jpg',
  photos:         ['...1.jpg', '...2.jpg', '...3.jpg'],
  commonness:     5,             // 1–5 star rating
  activityTime:   '白天',
  difficulty:     1,             // observation difficulty 1–5
  hotspot:        '校園各大樹群',
  story:          '...',
  idClues:        ['...', '...'],
  scientific:     '...',
  classification: '...',
  dist:           '<ul>...</ul>',
  threats:        '<ul>...</ul>',
  conservation:   '<ul>...</ul>',
}
```

This centralised object is consumed by four modules without duplication: map modal, animals grid, species detail page, and game results renderer.

### Image Asset Convention

Images follow a strict naming convention enforced programmatically:

```
assets/images/species/{chineseName}/{chineseName}1.jpg   (indices 1–3)
assets/images/plants/{chineseName}/{chineseName}1.jpg    (indices 1–3)
```

`plant-images.js` uses `encodeURIComponent(name)` when building probe URLs to handle Chinese-character folder names in HTTP contexts. All file extensions use lowercase `.jpg` to ensure cross-platform consistency (critical on case-sensitive Linux servers).

---

## Feature Implementation

### Wildlife Explorer (`animals.html` + `animals.js`)

The explorer renders a filterable card grid from `window.speciesData`. Filter tabs correspond to `group` values in the data schema. Clicking a card opens a drawer (`<div class="drawer">`) that slides in via CSS `transform: translateX()` transition.

The drawer displays the species' `photos` array as a gallery. Viewed species keys are persisted to `localStorage` under `ncu-wildlife-discovered`, enabling a "discovered" badge state across page loads.

Clicking "完整圖鑑" navigates to `pages/species.html?species={key}`, where `species-page.js` reads `URLSearchParams` to look up the matching entry in `speciesData`.

### Plant Explorer (`plants.html` + `plants.js` + `plant-images.js`)

`plants.js` generates floating leaf particles as absolutely-positioned `<div>` elements with randomised `animation-delay`, `animation-duration`, and horizontal `left` values injected as inline styles. This creates the ambient leaf-fall effect without canvas or WebGL.

Plant cards display primary images loaded via `PlantImages.loadPrimary(name)`, which probes the candidate URL with `new Image()`. On `onload`, the image is injected into the card's photo div; on `onerror`, a placeholder is shown — preventing layout shifts from broken image sources.

Clicking a card navigates to `pages/plant-detail.html?plant={name}`. `plant-detail.js` reads `URLSearchParams`, fetches the `.md` file, and populates a 10-section scrollable layout. A floating side-navigation with dot indicators tracks the active section via a second `IntersectionObserver` instance.

### Campus Ecosystem Guardian (3-page flow)

The game spans three pages with state passed through `sessionStorage`.

**Briefing page (`ecosystem-guardian.html`):**
Five challenge cards (`.eg-card`) present distinct ecological scenarios. Each card navigates to the game via `onclick="location.href='pages/ecosystem-game.html'"`. Three SDG reference cards link to official UN SDG pages as `<a>` elements.

**Game engine (`ecosystem-game.js`):**
Implemented as an IIFE containing a state machine:

```
State: { currentChapter, health, choices[], deltas[], isAnimating }

Chapter flow:
  loadChapter(n)
    → populate DOM from GAME_SCENARIOS[n-1]
    → fade-in scene background image
    → bind choice buttons

  handleChoice(choiceKey)
    → isAnimating guard (prevents double-submission)
    → apply health delta (clamped to [0, 100])
    → record to state.choices / state.deltas
    → show feedback panel (slide-in CSS animation)
    → "Next chapter" button: advance or call showEndScreen()

  showEndScreen()
    → serialise state to sessionStorage (key: eg_results)
    → reveal .gm-end overlay
    → animate SVG score ring via stroke-dashoffset
    → determine verdict text from health thresholds
```

Health bar colour transitions (green → amber → red) are driven by inline `width` style updates and a CSS class swap on each delta application.

**Results page (`ecosystem-results.js`):**
Reads `sessionStorage.getItem('eg_results')` on load. Tier classification uses a threshold array:

```js
const TIERS = [
  { min: 90, title: 'NCU Ecosystem Master'    },
  { min: 70, title: 'Campus Guardian'         },
  { min: 50, title: 'Nature Observer'         },
  { min:  0, title: 'Explorer in Training'    },
];
const tier = TIERS.find(t => health >= t.min);
```

Species impact cards are rendered from a `SPECIES_OUTCOMES` map keyed by `'{chapter}-{choiceKey}'`. The decision timeline renders one row per chapter showing the chosen option, health delta, and outcome classification.

---

## Routing Architecture

### Strategy 1 — In-page section switching (index.html)

`navigation.js` implements client-side section switching without URL changes:

```js
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    window.scrollTo(0, 0);
    // Re-run scroll reveal for newly visible content
    if (typeof window.reinitializeAnimations === 'function') {
        setTimeout(() => window.reinitializeAnimations(), 100);
    }
}
```

All navigation triggers use `[data-page]` attributes bound at init time. Hash-based deep links (e.g. `index.html#resources`) are handled by reading `window.location.hash` on load.

### Strategy 2 — URL parameter–driven detail pages

`species.html` and `plant-detail.html` are generic templates populated at runtime:

```js
// species-page.js
const key     = new URLSearchParams(window.location.search).get('species');
const species = window.speciesData.animals[key];

// plant-detail.js
const plantName = new URLSearchParams(window.location.search).get('plant');
fetch(`data/plants/${plantName}.md`).then(...);
```

### Route Map

| Entry Point | URL | Handler |
|-------------|-----|---------|
| Home | `index.html` | `showPage('home')` |
| Resource Centre | `index.html` → nav click | `showPage('resources')` |
| Join / Form | `index.html` → nav click | `showPage('join')` |
| Wildlife Explorer | `pages/animals.html` | `animals.js` |
| Species Detail | `pages/species.html?species={key}` | `species-page.js` |
| Plant Explorer | `pages/plants.html` | `plants.js` |
| Plant Detail | `pages/plant-detail.html?plant={name}` | `plant-detail.js` |
| Campus Map | `pages/wildlife-map.html` | `map.js` (standalone) |
| Game Briefing | `pages/ecosystem-guardian.html` | `ecosystem-guardian.js` |
| Game | `pages/ecosystem-game.html` | `ecosystem-game.js` |
| Results | `pages/ecosystem-results.html` | `ecosystem-results.js` |

---

## Responsive Design Strategy

All layouts are built mobile-first using CSS Grid and Flexbox. No JavaScript-based layout switching is used — all adaptation is handled in CSS.

### Key Responsive Patterns

**Card Grids:** Species and plant card grids use `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`. This is intrinsically responsive — no breakpoint-specific column overrides are needed.

**Navigation:** On mobile (`< 768px`), the navbar collapses to a hamburger menu toggled by adding/removing a CSS class — no inline style manipulation.

**Game Scene:** The background (`#sceneBg`) uses `object-fit: cover` on a full-viewport `<div>`, adapting to any aspect ratio without JavaScript.

**Wildlife Map:** Uses `vw`/`vh` units and `object-fit: contain` for the campus map image. The back button collapses to icon-only on screens narrower than `480px` by hiding the label `<span>` via media query.

**Plant Detail Side-nav:** The 10-section dot navigation is hidden on mobile (`display: none`) to avoid obstruction on narrow viewports.

---

## UI/UX Design Decisions

### Dark Theme with Nature Accent Palette
The site uses a dark base (`#0a0f0a`, `#111811`) with green accents (`#2d6a4f`, `#52b788`, `#95d5b2`). This palette references forest ecology. All colour combinations meet WCAG AA contrast ratios for body text.

### Mouse Spotlight Effect
`mouse-spotlight.js` tracks `mousemove` and updates a CSS `radial-gradient` on a fixed overlay element via `requestAnimationFrame`. Linear interpolation smooths cursor lag without layout thrashing:

```js
currentX += (targetX - currentX) * 0.08;
currentY += (targetY - currentY) * 0.08;
spotlight.style.background = `radial-gradient(600px at ${currentX}px ${currentY}px, ...)`;
```

### Glassmorphism Panels
Map side panels and game feedback overlays use `backdrop-filter: blur(18px) saturate(180%)` with semi-transparent backgrounds. `-webkit-` prefix is included for Safari compatibility.

### SVG Score Ring Animation
The results page uses an SVG `<circle>` with `stroke-dasharray` / `stroke-dashoffset`. On load, `stroke-dashoffset` is animated from the full circumference to `circumference × (1 − score/100)` via `requestAnimationFrame` with an easing function, allowing the target value to be computed dynamically at runtime.

### Loading Overlay
A full-viewport overlay is shown on page parse (no JS needed for initial display). `main.js` adds `fade-out` after `DOMContentLoaded` + 280 ms, letting the browser complete its first paint before the overlay lifts. A `transitionend` listener then sets `display: none` to remove it from the accessibility tree.

### Scroll Reveal Consistency
All content sections use `.scroll-reveal` with a unified `translateY(-20px) → translateY(0)` + `opacity: 0 → 1` transition. `animations.js` exposes `reinitializeAnimations()` so dynamically loaded or newly visible content (after page switching) can be re-observed.

---

## Installation & Local Development

This project has **no build step and no dependencies**. All files are static assets.

### Option 1 — VS Code Live Server (recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.
3. Site opens at `http://127.0.0.1:5500/`.

### Option 2 — Python HTTP server
```bash
python -m http.server 8080
# then open http://localhost:8080
```

### Option 3 — Node.js serve
```bash
npx serve .
```

> **Important:** Do not open `index.html` directly as a `file://` URL. `fetch()` calls in `plant-detail.js` will be blocked by the browser's CORS policy. An HTTP server is required.

---

## Build and Deployment

There is no build process. Deployment requires copying the project directory to any static file host.

### GitHub Pages
```bash
git init
git add .
git commit -m "initial deploy"
git remote add origin https://github.com/{user}/{repo}.git
git push -u origin main
# Settings → Pages → Source: main / (root)
```

### Nginx (Self-hosted)
```nginx
server {
    listen 80;
    root /var/www/campus-nature-explorer;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Asset Optimisation (Pre-deployment)
All images are uncompressed `.jpg`. Before production deployment:
- Run images through `sharp` or `imagemin` for compression
- Convert `ncu_ecology_map.png` (campus map) to WebP — it is the largest single asset
- Consider lazy-loading `<img loading="lazy">` is already applied on most non-hero images

---

## Future Technical Improvements

### 1. CMS Integration
Plant and species content is authored as static `.md` files and a monolithic JS data object. Replacing these with a headless CMS (Contentful, Strapi, or Directus) would decouple content authorship from the codebase and allow non-technical contributors to update species records without touching code.

### 2. Backend + Database for Observation Records
`animals.js` tracks discovered species in `localStorage`. A proper backend (Node.js + PostgreSQL or Firebase Firestore) would enable persistent cross-device records, community observation submissions, and aggregate sighting heatmap visualisation.

### 3. Full-Text Search
At current scale (17 species, 10 plants), grid browsing is sufficient. At larger scale, a client-side search index (Fuse.js or MiniSearch) would enable instant fuzzy search across species names, descriptions, and habitats without a server round-trip.

### 4. GIS-Based Interactive Map
The current `wildlife-map.html` uses a static campus photograph with hardcoded CSS `position: absolute` pins. Replacing it with Leaflet.js or MapLibre GL would enable accurate geographic coordinates, observation point clustering, and user-submitted sighting pins with real map tiles.

### 5. ES Module Refactor + Bundler
The current `window.*` pattern avoids ES module syntax to maintain `file://` compatibility during development. Migrating to ES modules with Vite or esbuild would enable tree-shaking, code splitting (load game scripts only on game pages), and TypeScript type checking.

### 6. Accessibility Audit
Current ARIA usage is partial. A WCAG 2.1 AA audit should address: keyboard trap management in modals, `aria-live` regions for game feedback panels, colour contrast review on amber/green accent combinations, and focus-visible outlines on all interactive elements.

### 7. Service Worker (Offline Support)
A Cache API service worker would allow the site to function offline after the first visit — relevant for field use during on-campus ecology observation activities.

---

## Contributors

| Role | Name | Student ID | Contributions |
|------|------|------------|---------------|
| Developer / Designer | 張 勛 | 113522056 | All HTML, CSS, JavaScript, content authoring, and asset organisation |

*National Central University · Department of Information Management*
*Course: Web Programming · Spring 2026*

---

## Conclusion

Campus Nature Explorer demonstrates a complete front-end engineering workflow without relying on any JavaScript framework or CSS utility library. Key technical achievements:

- **Modular JS architecture** — 17 single-responsibility modules communicating through well-defined global interfaces (`window.speciesData`, `window.GAME_SCENARIOS`, `sessionStorage`) rather than tight coupling
- **Runtime Markdown parsing** — plant content is fetched and parsed at runtime with custom regex-based parsers, achieving content–presentation separation with zero build dependencies
- **Dynamic image discovery** — `plant-images.js` probes candidate URLs via the `Image` constructor rather than maintaining a static registry, making the naming convention the only contract needed
- **State machine game engine** — `ecosystem-game.js` implements a 5-chapter progression state machine entirely in vanilla JS, including animated health bars, SVG ring animation, and cross-page state transfer via `sessionStorage`
- **Dual routing strategy** — combining in-page section switching (SPA-like for the index) with URL-parameter–driven detail pages (for species and plant detail) provides a coherent navigation model without a router library

The project prioritises readability and maintainability of plain HTML/CSS/JS over framework convenience, making it an instructive reference for foundational web programming techniques.

