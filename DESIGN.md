# Hushfield Web Design

<!-- impeccable:design-schema 1 -->

## Visual World

**THESIS:** A nocturnal listening room where the real Hushfield interface emerges from quiet darkness, not a generic SaaS dashboard.
**OWN-WORLD:** Deep mineral green-black fields, warm cream type, muted brass lines, and soft amber pools of light; editorial serif display paired with a precise sans-serif.
**STORY:** Visitors understand that Hushfield is a mobile ambient sound app, are walked through the four screens that make up the app, see the real library, then choose a store.
**FIRST VIEWPORT:** A detached floating nav pill spans the top centre; the large serif promise and store actions sit left while a real, upright app screen in an iPhone frame rises from a low amber glow on the right.
**FORM:** Workbench — a guided product tour. Numbered stages alternate side to side, each pairing one real capture with one short annotation. The screenshots are the argument; the copy is caption-weight.

## Tokens

All tokens live in [`tokens.css`](tokens.css) and are the single source of truth. Nothing in
`marketing.css` may inline a colour or a `font-family`; add a token first, then reference it.

- Background `#111613`, surface `#171d19`, raised surface `#202720`, brand tile `#0a1d17`.
- Primary text `#f5efe3`, secondary text `#c9c2b5`, brass accent `#c5a46d`.
- Display type: Cormorant Garamond. UI type: Manrope. Two families, no third.
- Borders are warm, low-contrast hairlines. Shadows are restrained, tight and dark — never a glow.
- Spacing is a 4pt scale (`--space-2xs` … `--space-3xl`); section padding varies section to section on purpose.

## Logo

- The mark is `assets/brand/hushfield-symbol.svg` — the white *h* on dark mineral. It is used
  as-is; do not recolour, redraw, or restack it.
- Web tiles round the square at 27 % so the mark reads as an app icon in a browser chrome.
- Header and footer pair the mark with the wordmark set in Cormorant Garamond.
- The same mark is the favicon and drives the legal/support pages' `.brand-logo-mark`.

## Layout & Motion

- Generous vertical breathing room, strong editorial scale, and real screenshots without distortion.
- Screenshots sit inside an iPhone frame built to real iPhone 15 Pro geometry (2.165 screen aspect,
  14 % corner radius, ~3 % rail, Dynamic Island at 30 % width). The frame scales from one custom
  property, `--dev-w`, which carries a `vw` term so it never outgrows its column. The contained
  interface is never altered or cropped.
- Headings are always roman. Emphasis is carried by the brass accent, never by italics.
- Motion is three primitives only: a staggered load reveal in the hero, the sticky bar's slide,
  and a 1–2 px hover translate on store buttons. All of it collapses under `prefers-reduced-motion`.

## Copy rules

Every number and product name on the page is taken from a real app capture in
`assets/screenshots/` — twelve atmospheres, the four intents, the four-layer mix ceiling, the
62/38/26/72 % slider values, and the six named atmospheres. **Do not add a metric the app does
not show.** If a proof slot has no real number, cut the slot.

## Verified viewports

`index.html` is checked at 320 / 375 / 414 / 768 / 1200 / 1440 px for horizontal overflow,
two-line clickable text, and sub-44px hit targets. Re-run that check after any layout change.
