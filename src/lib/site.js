import analysis from '../data/images.json';

/* Every image inside a project folder, as Astro image metadata. */
const images = import.meta.glob('/src/content/projects/*/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });

/* A path inside the site, with the base path in front ("work/" -> "/FUN_OMA_style_homepage/work/"). */
export function url(path = '') {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
  return base + String(path).replace(/^\/+/, '');
}

export function projectUrl(slug) {
  return url(`work/${slug}/`);
}

/* An image from a project folder with its measurements:
   { meta, ratio, ground: 'dark' | 'light', lqip } */
export function projectImage(slug, file) {
  const key = `${slug}/${file}`;
  const meta = images[`/src/content/projects/${key}`];
  const info = analysis[key];
  if (!meta) throw new Error(`Missing image src/content/projects/${key}`);
  if (!info) throw new Error(`No analysis for ${key}: run npm run analyze`);
  return { meta, ratio: `${info.width} / ${info.height}`, ground: info.ground, lqip: info.lqip };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function ordinal(day) {
  if (day % 10 === 1 && day !== 11) return 'st';
  if (day % 10 === 2 && day !== 12) return 'nd';
  if (day % 10 === 3 && day !== 13) return 'rd';
  return 'th';
}

/* "August 21st 2026", "August 2026" or "2026"; a dateLabel wins. */
export function formatDate(date, precision = 'day', label) {
  if (label) return label;
  const d = new Date(date);
  const month = MONTHS[d.getUTCMonth()], day = d.getUTCDate(), year = d.getUTCFullYear();
  if (precision === 'year') return String(year);
  if (precision === 'month') return `${month} ${year}`;
  return `${month} ${day}${ordinal(day)} ${year}`;
}

/* The machine-readable form for <time datetime>, at the same precision. */
export function isoDate(date, precision = 'day') {
  const iso = new Date(date).toISOString();
  return precision === 'year' ? iso.slice(0, 4) : precision === 'month' ? iso.slice(0, 7) : iso.slice(0, 10);
}

export function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* One set per topic of this project, holding the other projects that share it.
   A project shows once, in the first set it fits; empty sets are dropped. */
export function relatedByTopic(project, all, perSet = 4) {
  const seen = new Set([project.id]);
  return project.data.topics
    .map((topic) => {
      const list = all.filter((p) => !seen.has(p.id) && p.data.topics.includes(topic)).slice(0, perSet);
      list.forEach((p) => seen.add(p.id));
      return { label: topic, list };
    })
    .filter((set) => set.list.length > 0);
}

export function byOrder(a, b) {
  return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
}

/* Newest first; entries without a day sort as the first of their month or year. */
export function byDateDesc(a, b) {
  return new Date(b.date ?? b.data.date) - new Date(a.date ?? a.data.date);
}
