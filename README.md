# EAS — Electrical Automation Staffing

The marketing website for **EAS**, repositioned as *the manufacturing talent
authority* — a direct-hire recruiting firm built by former maintenance and
automation leaders. It sells one thing clearly: **manufacturing direct hire**.

This is a **zero-build static site**. The HTML files in the repo root are ready
to deploy as-is to any static host (Netlify, Vercel, GitHub Pages, S3,
Cloudflare Pages, or your current host). No server, framework, or build step is
required to *run* it — you only need Node if you want to *edit content and
regenerate* the pages.

---

## Positioning baked into the site

The site was built to answer "Why EAS?" in five seconds and to lead with the
one thing no generic staffing firm can claim — that the recruiters have done
the work themselves:

- **Homepage hero:** "We Recruit the Manufacturing Professionals Other
  Recruiters Can't." + "Former maintenance leaders. Manufacturing experts.
  Direct hire only."
- **Credibility first** — Former Maintenance Manager / PLC Technician / Controls
  Engineer / Maintenance Leader.
- **Direct Hire is the primary product**; training is intentionally *not* in the
  navigation.
- **Positions We Recruit** — a full icon grid of the technical roles.
- **Industry pages** — dedicated, SEO-targeted pages (food, dairy, bakery,
  packaging, beverage, cold storage, plastics, can, paper, chemical).
- **Proof / stats**, a **7-step process**, **testimonials**, **manufacturing
  imagery**, a **resources/articles** library, and **role-specific CTAs**
  ("Need a Maintenance Technician?  Request Candidates →").

---

## Project structure

```
/                              ← deploy this whole folder
├── index.html                 ← Home
├── direct-hire.html           ← Core service page
├── industries.html            ← Industries overview
├── positions.html             ← Positions We Recruit
├── about.html                 ← Credibility / story
├── success-stories.html       ← Testimonials & case studies
├── resources.html             ← Article index
├── contact.html               ← Request Candidates form
├── 404.html
├── <industry>-recruiting.html ← 10 generated industry pages
├── <article-slug>.html        ← 6 generated article pages
├── sitemap.xml / robots.txt    ← generated
├── assets/
│   ├── css/styles.css         ← design system (edit styling here)
│   └── js/main.js             ← mobile nav, scroll reveals, form handling
└── scripts/
    └── build.mjs              ← SOURCE OF TRUTH for all page content
```

> **Important:** the `.html` files are **generated** from `scripts/build.mjs`.
> If you edit an `.html` file directly, a rebuild will overwrite it. Edit
> `scripts/build.mjs` (or just `assets/css/styles.css` for pure styling) and
> rebuild.

---

## Editing content & rebuilding

All copy, navigation, positions, industries, testimonials, stats, and articles
live in clearly-labelled data arrays near the top of `scripts/build.mjs`.

1. Edit the data/content in `scripts/build.mjs`.
2. Regenerate every page:

   ```bash
   node scripts/build.mjs
   ```

3. Commit the regenerated `.html` files.

Common edits:

| Want to change… | Edit this in `scripts/build.mjs` |
| --- | --- |
| Phone, email, company name, coverage area | the `SITE` object |
| Photos | the `IMG` object (drop in your own URLs or local files) |
| Roles in the Positions grid | the `POSITIONS` array |
| Industry pages | the `INDUSTRIES` array (add an entry → new page + nav/footer links) |
| Testimonials | the `TESTIMONIALS` array |
| Stat tiles | the `STATS` array |
| Articles | the `ARTICLES` array |

---

## Photos

Placeholder imagery is loaded from the **Unsplash CDN** (industrial /
manufacturing photos) via the `IMG` object in `scripts/build.mjs`. These load in
the visitor's browser, so the site looks real immediately.

**Replace them with your own photography** for maximum authenticity — point each
`IMG` entry at your own URL, or save files under `assets/img/` and reference
them (e.g. `assets/img/control-panel.jpg`), then rebuild. Use real shots: PLC
panels, packaging lines, conveyors, food plants, technicians troubleshooting,
controls engineers, industrial robots.

---

## Wiring up the "Request Candidates" form

The contact form (`contact.html`) is **already wired to submit via Formspree** —
you just need to give it your form ID. It submits over `fetch`, so the visitor
stays on the page and sees an inline confirmation. Until a real ID is set, the
form stays in safe **demo mode** (shows the confirmation without sending), so it
never looks broken.

**To go live (about 2 minutes):**

1. Create a free form at [formspree.io](https://formspree.io) and point it at
   `recruiting@eautomatedstaffing.com` (or whichever inbox should receive
   hiring inquiries).
2. Copy the form ID Formspree gives you (it looks like `https://formspree.io/f/abcdwxyz`).
3. In `scripts/build.mjs`, set `FORM.endpoint` to that URL.
4. Run `node scripts/build.mjs` and deploy.

That's it — submissions then arrive in your inbox and Formspree dashboard. The
form includes a hidden honeypot field for basic spam protection and a friendly
error message (with phone/email fallback) if a submission ever fails.

**Prefer a different backend?**

- **Netlify Forms:** if you deploy to Netlify, add `netlify` and
  `name="request-candidates"` attributes to the `<form>` in `contactPage()`,
  set `FORM.endpoint` to a non-placeholder value, and rebuild.
- **Your own endpoint / ATS:** point `FORM.endpoint` at your API. The
  `fetch`-based handler in `assets/js/main.js` posts the form as `FormData` with
  an `Accept: application/json` header and treats any `2xx` as success.

---

## Deploying

Because it's plain static files, deploy the repository root to any host:

- **Netlify / Vercel / Cloudflare Pages:** connect the repo; no build command
  needed (publish directory = repo root).
- **GitHub Pages:** serve from the repository root of the published branch.
- **Any web host / S3:** upload all files, keeping the folder structure.

Update `SITE.domain` in `scripts/build.mjs` and rebuild so `sitemap.xml`,
`robots.txt`, and social tags reference your live domain.

---

## Accessibility & performance notes

- Semantic landmarks, skip-link, keyboard-operable mobile nav, focus styles, and
  `prefers-reduced-motion` support are built in.
- Images are lazy-loaded; fonts are loaded from Google Fonts with system
  fallbacks.
- All content is present in the HTML (no JS required to read the site); JS only
  enhances the menu, scroll reveals, and form feedback.
