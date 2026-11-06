import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const precision = z.enum(['day', 'month', 'year']);

/* One folder per project: src/content/projects/<slug>/index.md plus its images.
   The folder name is the slug: it becomes the page URL /work/<slug>/. */
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0]
  }),
  schema: z.object({
    title: z.string(),
    label: z.string(),                       // short name for the home label box
    summary: z.string(),                     // one sentence for listings and meta tags
    status: z.enum(['Ongoing', 'Completed']).default('Ongoing'),
    statusNote: z.string().optional(),       // e.g. "paper in preparation"
    started: z.number().int().optional(),    // year
    topics: z.array(z.string()).min(1),      // drives the filters and the related footer
    role: z.string().optional(),
    hardware: z.string().optional(),
    specs: z.array(z.object({                // more rows for the metadata table, after Hardware
      label: z.string(),
      value: z.string()
    })).default([]),
    funding: z.string().optional(),
    partners: z.array(z.string()).optional(),
    team: z.string().optional(),             // one line; the rest of the team goes in teamMore
    teamMore: z.array(z.string()).optional(),
    paper: z.string().optional(),
    cover: z.string(),                       // file name in the project folder
    coverAlt: z.string(),
    coverIllustration: z.boolean().default(false),
    coverGround: z.enum(['light', 'dark']).optional(), // override the measured brightness for the nav ink
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      size: z.enum(['full', 'wide', 'third']).default('third'),
      illustration: z.boolean().default(false)
    })).default([]),
    /* project history for the page's timeline; news items that name this project join it */
    timeline: z.array(z.object({
      date: z.coerce.date(),
      precision: precision.default('month'),
      dateLabel: z.string().optional(),
      text: z.string()
    })).default([]),
    order: z.number().default(100),          // home and index order, lowest first
    featured: z.boolean().default(true),     // show on the home collage
    labelLeft: z.number().optional(),        // pin the home label: units from the plate's left edge
    labelTop: z.number().optional(),         // and from its top (1 unit = 1% of the page width)
    draft: z.boolean().default(false)
  })
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    precision: precision.default('day'),
    dateLabel: z.string().optional(),        // e.g. "Summer 2026"
    project: z.string().optional(),          // slug: hangs the card on that project's plate
    source: z.string().optional(),           // outlet or venue, for outside links
    url: z.string().url().optional(),
    draft: z.boolean().default(false)
  })
});

const papers = defineCollection({
  loader: file('src/content/papers.json'),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    year: z.number().int(),
    status: z.enum(['Published', 'Under review', 'In revision', 'In preparation']),
    venue: z.string().optional(),            // only once accepted or published
    url: z.string().url().optional(),
    pdf: z.string().optional(),              // file in public/papers/
    project: z.string().optional()
  })
});

export const collections = { projects, news, papers };
