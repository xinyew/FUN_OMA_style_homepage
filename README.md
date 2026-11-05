# Xinye — research site

A static research-projects site built with [Astro](https://astro.build) on **Supergraphic Index**, a small black-and-white template: a full-width nav set as a supergraphic, grayscale indexes, full-color plates and one red for news. The template's behaviors were worked out by studying how oma.com's interface behaves; no code, images or fonts from that site are used.

Live (once deployed): https://xinyew.github.io/FUN_OMA_style_homepage/

## Run it

```sh
npm install
npm run dev       # measures the images, then serves http://localhost:4321/FUN_OMA_style_homepage/
npm run build     # writes dist/
npm test          # layout and search tests for the template script
```

Node 22.23.4 or newer.

## Edit the content

| What | Where |
| --- | --- |
| Name, nav words, the hover word, GitHub, email, collage seed | `src/site.config.mjs` |
| A project | `src/content/projects/<slug>/index.md` plus its images in the same folder |
| News | `src/content/news/*.md` |
| Papers | `src/content/papers.json` |
| CV | put `public/cv.pdf` in place and the links appear |

**A project** is one folder; the folder name is its URL (`/work/<slug>/`). Front matter:

```yaml
title: Pressure-injury sensing mask for pediatric CPAP   # page and index title
label: Pressure-injury mask        # short name in the home label box
summary: One sentence for meta tags and search.
status: Ongoing                    # or Completed; groups the work index
statusNote: paper in preparation   # optional, after the status
started: 2026
topics: [Sensing, Health]          # topic filter and related-work footer
role: Multi-sensor BLE board and tablet app
hardware: …                        # optional rows: partners (list), funding, team, teamMore (list), paper
cover: cover.jpg                   # file in this folder
coverAlt: What the image shows.
coverIllustration: true            # prints an ILLUSTRATION tag on the image
gallery:                           # optional; size: full (keeps its ratio), wide or third
  - { src: cv.jpg, alt: "…", size: full, illustration: true }
timeline:                          # optional project history; news naming this project joins it
  - { date: 2026-05-01, precision: month, text: Joined the project }
order: 2                           # lowest first, on home and in the index
featured: true                     # false keeps it off the home collage
labelLeft: 10                      # optional: pin the home label (units = % of page width,
labelTop: 20                       #   measured from the plate's top-left corner)
draft: false
```

The body (Markdown) is the lead text on the project page.

**News** items take `title`, `date`, `precision` (`day`, `month` or `year`), an optional `dateLabel` ("Summer 2026"), `source`, `url`, and `project`. A news item with a `project` hangs off that project's plate on the home page and joins its timeline; one without floats between plates.

**Papers** take `title`, `authors`, `year`, `status` (`Published`, `Under review`, `In revision`, `In preparation`), and optionally `venue` (once accepted), `url`, `pdf` (a file in `public/papers/`) and `project`. Work in progress is grouped by stage, published work by year.

## What the template does

The template lives in `src/design-system/` (`tokens.css`, `bundle.css`, `bundle.js`) and matches the Supergraphic Index design system. `bundle.js` has no dependencies; `SupergraphicIndex.init()` wires everything.

- **Nav fit.** The four words are sized from the nav's `clientWidth`, not `100vw`, so a scrollbar never pushes them past the edge. `data-si-fill="0.89"` leaves room after the home word for its wider hover word.
- **Nav tuck.** Every scrolled pixel moves the words one pixel, up to 10px + 83% of a word, and scrolling back brings them down. Only the hollow home word stays put (`si-nav--tuck-current`; drop that class to keep the current section's word down too, as oma.com does). Keyboard focus brings the row back.
- **Nav ink.** `npm run analyze` measures the top 15% of each image (`scripts/analyze-images.mjs`, written to `src/data/images.json`). Under a brightness of 157 the nav turns white over that image. Mark any band with `data-si-ground="dark"`, `"light"` or `"background"` (decide from its background color) to set it by hand.
- **Collage.** The home feed is laid out by `layoutCollage`, a pure function seeded from `site.seed`: plates stack, labels drop onto their plate, cards hang over a plate's lower edge or float into free space, and nothing is ever dropped. The same seed gives the same layout; change it to reshuffle. Under 768px the same markup reads as a stacked list.
- **Filters in the URL.** Search, topic and list/grid on `/work/` write `?q=`, `?topic=` and `?view=`, so a filtered view can be linked and the back button works.
- **Placeholders.** Each image gets a 24px blurred preview from the analysis step while the real one loads.

The theme follows the system's light or dark setting.

## Placeholder illustrations

Everything except the UbiStat cover photo is a drawn placeholder from `scripts/make-plates.py`, not data. Those images carry `illustration: true` and show an ILLUSTRATION tag. Replace them with real photos and figures, then remove the flag. Re-running the script rewrites the placeholders in place.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. One-time setup: repository **Settings → Pages → Source: GitHub Actions**.

The site is built for `https://xinyew.github.io/FUN_OMA_style_homepage/`. For a custom domain or a `<user>.github.io` repository, set `BASE_PATH=/` and `SITE_URL=https://your.domain` in the build step.

## Layout

```
src/
  content/            projects/<slug>/index.md + images, news/*.md, papers.json
  content.config.ts   the content schema
  design-system/      the template: tokens.css, bundle.css, bundle.js
  components/         Nav, Media, SignalCard, IndexRow, RelatedFooter, SiteFooter
  layouts/            BaseLayout.astro
  pages/              home, work, work/[slug], papers, about, 404
  lib/site.js         URLs, dates, image lookup, related-by-topic
  styles/site.css     site-only styles
  site.config.mjs     site settings
scripts/              analyze-images.mjs, make-plates.py
tests/                node:test suite for the layout and search
```
