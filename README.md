# Abdur Rauf — Portfolio

Personal portfolio and services site for **Abdur Rauf** — Full Stack Developer and
Technical Operations Team Lead at AESYRIX, based in Rawalpindi, Pakistan.

Live: <https://raufokz.github.io/Abdur-Rauf/>

## Structure

```
index.html                    Main profile page (all sections, server-rendered)
404.html                      Not-found page
sitemap.html                  Human-readable page index
sitemap.xml / robots.txt      Search engine files

css/site.css                  Design system (light + dark, no framework)
js/site.js                    Progressive enhancement only

services/                     Service landing pages (one per core service)
case-studies/                 Long-form project write-ups
assets/                       Images, CV PDF, icons
```

Static HTML, CSS and JavaScript. No build step — edit and commit.

## Principles this site is built on

1. **All content lives in HTML.** Nothing important is injected by JavaScript.
   Search engines and users with a failed script both see the full page.
2. **No unverifiable claims.** No ratings, client counts, revenue figures or
   percentage improvements are published unless they can be evidenced. Places
   where real data belongs are marked with a visible `.todo` / `.note` block.
3. **Every page targets one topic.** Service and case study pages exist so the
   site has more than a single URL competing for search traffic.
4. **Performance is a feature.** No icon fonts, no CDN scripts in the critical
   path, one web font, inline SVG icons, WebP images.

## Editing

- **Add a project** — copy an `<article class="proj-card">` or `<article class="mini">`
  block in the Projects section of `index.html`.
- **Add a service page** — copy an existing file in `services/`, update the
  `<title>`, meta description, canonical URL and JSON-LD, then link it from
  `index.html`, `services/index.html`, the footer and `sitemap.xml`.
- **Change colours** — edit the custom properties at the top of `css/site.css`.
  Light values sit on `:root`; dark values are repeated in the two dark blocks.

## Outstanding items

Search the codebase for `class="note"` and `class="todo"` — each marks content
that needs real data before it should be published as fact:

- [ ] **Domestic Real Estate screenshot** — only project still using the logo rather than a screenshot
- [ ] **Exact production stack for Domestic Real Estate** — currently described generically
- [ ] **Verified results** for the three case studies (analytics, CRM exports, client confirmation)
- [ ] **Correct LinkedIn URL** — two different ones existed previously; confirm and use one everywhere
- [ ] **ISA / real estate call agent dates** — marked `2024` in `cv.html` and on the site
- [ ] **Export the CV** — open `cv.html`, Ctrl+P → Save as PDF, replace `assets/doc/pdf/AbdurRauf.pdf`
- [ ] **Link testimonials to their source** (Upwork/Fiverr/LinkedIn) so they are verifiable

## Outbound

`OUTBOUND.md` holds the LinkedIn profile copy, Upwork profile and proposal
template, cold-email scripts and a weekly sending rhythm. The site closes;
those open. Neither works alone.

## License

MIT — see [LICENSE](./LICENSE).
