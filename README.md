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
| `favicon.svg` | Hexagon brand mark. |
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

The site deliberately does not invent facts. These still need supplying:

- **Registered address** and **phone number** — currently shown as "to be
  published" placeholders in the contact section.
- **Email hosting** for `info@` / `sales@ctiworld.online`. The addresses are
  referenced throughout but will bounce until mail is configured for the domain.
- **LinkedIn / X URLs** — footer social links point at `#`.
- **Company metrics.** Earlier copy claimed "25+ years", "50+ research patents"
  and "98% client satisfaction". These were not verifiable and have been removed
  rather than published as fact. Add them back once accurate.
- **A transparent logo asset.** `PHOTO-2026-04-05-17-43-25.jpg` is a photograph
  of the logo on a wall, so it cannot sit on the dark footer. The nav and footer
  use an inline SVG that mirrors the mark; replace it with the real vector file
  when available.
- **A form backend.** Submissions currently open the visitor's mail client.
  Point the form at Formspree, Basin or similar for reliable capture.
