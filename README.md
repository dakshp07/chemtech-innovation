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
| `favicon.svg` | Standalone brand mark, same geometry as the `#i-mark` sprite symbol. |
| `tools-gen-helix.py` | Generates the DNA double-helix geometry. Not used at runtime — run it to regenerate the strand paths if the mark needs retuning. |
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

The hexagon, double helix and growth arrow are drawn as vector geometry rather
than traced by hand. The helix comes from `tools-gen-helix.py`: two sine-wave
strands in antiphase, split into front and back runs by their depth (`cos` of
the phase) so the backbones visibly cross, with rungs whose width and opacity
track strand separation — that is what conveys rotation.

The mark carries real detail, so it is displayed at 54px in the nav and 64px in
the footer. Much below ~40px the helix and lattice merge into texture. If you
need a small-size variant, simplify the geometry rather than scaling this one
down.

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
