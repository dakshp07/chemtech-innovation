# ChemTech Innovation (CTI) — ctiworld.online

Marketing site for ChemTech Innovation: chemicals and raw materials, pharma
intermediates, CRO, CDMO, technical consultancy and M&A advisory.

Static HTML/CSS/JS — no build step, no dependencies. Deployed via GitHub Pages.

## Local development

```bash
python3 -m http.server 8000        # http://localhost:8000
```

Add `--bind 0.0.0.0` to reach it from other devices on the same network. Note
that exposes the whole directory to everyone on that network — avoid on
untrusted or public Wi-Fi.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Single-page site. All SVG icons are defined once as `<symbol>`s at the top and referenced with `<use>`. |
| `styles.css` | Design tokens in `:root`, then components in section order. |
| `script.js` | Progressive enhancement only. One rAF-throttled scroll listener drives the navbar, active link and back-to-top. |
| `logo-mark.png` | Brand mark, extracted from the source photograph with the background keyed out. |
| `favicon-32.png` / `favicon-64.png` / `apple-touch-icon.png` | Icon set generated from `logo-mark.png`. |
| `CNAME` | Custom domain for GitHub Pages. |
| `.nojekyll` | Serve files as-is, skip Jekyll. |

## Design tokens

Derived from the brand mark — navy wordmark, emerald "INNOVATION", blue-to-green
hexagon gradient.

- Navy `#10233F` → `#1B3A6B` — headings, footer, dark surfaces
- Blue `#1565C0` — primary actions, links, icon fills
- Green `#2E9E4F` / `#46BD6B` — accents, confirmation, gradient terminus
- Neutrals `#0E1726` → `#F7F9FC`, hairline borders `#E3E8EF`

Change a token in `:root` and it propagates; avoid hard-coded hex values in
component rules.

## Brand mark

`logo-mark.png` is the real artwork, not a redraw. It was extracted from
`PHOTO-2026-04-05-17-43-25.jpg` (a photograph of the logo on a wall) by keying
out the background.

The key could not be done on brightness: the white vine inside the hexagon is
`(247,251,250)` and the wall behind it is `(249,251,250)` — indistinguishable. A
plain background flood fill therefore leaked through the vine where it meets the
hexagon edge and punched holes in the interior, visible only against the dark
footer.

The working approach uses hue, which separates cleanly: the hexagon body is
204-220 deg, the arrow 131-148 deg. Each mask is then filled row by row, which
is exact for a convex shape like the hexagon and closes the white interior that
hue cannot see. The result is eroded by one pixel, since the outermost ring
blends toward the wall grey and would otherwise fringe light against the footer.

Because it is raster, it is displayed at 54px (nav) and 64px (footer) against a
297x307 source — roughly 4x headroom, so it stays sharp on high-DPI screens. A
true vector original would still be preferable if one can be obtained.

## Accessibility

Skip link, visible `:focus-visible` rings, labelled form fields, `aria-expanded`
on the menu toggle, `role="status"` on the form result, and a
`prefers-reduced-motion` block that disables animation and scroll-reveal.

## Deployment

GitHub Pages serves `main`. Pushing to `main` publishes.

DNS for the apex domain at Namecheap (Advanced DNS):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `dakshp07.github.io.` |

Then enable **Enforce HTTPS** in the repo's Pages settings once the certificate
is issued.

## Outstanding — needs real information

Supplied and live: tagline ("Your Sourcing Partner"), contact email, registered
address, business hours.

Still outstanding:

- **LinkedIn / X URLs** — footer social links still point at `#`.
- **Phone number** — not published anywhere on the site.
- **Company metrics.** Earlier copy claimed "25+ years", "50+ research patents"
  and "98% client satisfaction". These were not verifiable and were removed
  rather than published as fact. Add them back once accurate.
- **A vector logo.** `PHOTO-2026-04-05-17-43-25.jpg` is a photograph of the logo
  on a wall, so it has a grey background and cannot sit on the dark footer. The
  nav, footer and favicon use an inline SVG approximation instead; replace it
  with the real vector when one exists.
- **Web3Forms access key.** The contact form posts to Web3Forms, which relays
  enquiries by email. Get a free key at https://web3forms.com (enter
  `innovationchemtech@gmail.com`, the key arrives by email) and replace
  `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `index.html`. The key is public by
  design — it only permits sending to the address it was issued for, so it is
  safe to commit. Until it is set, the form falls back to a `mailto:` handoff,
  so it is never a dead end.
- **Domain email** (optional). Contact runs through a Gmail address; `info@` and
  `sales@ctiworld.online` would need mail hosting on the domain.
