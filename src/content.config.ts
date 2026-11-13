import { defineCollection, reference, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * All site content lives in JSON files in src/data/.
 * Each item needs a unique "id" — that id is what other files use to reference it
 * (e.g. a publication's "members": ["sajid-ullah-butt"]).
 */

/** Optional text: empty string "" is treated as "not set". */
const optUrl = z.union([z.string().url(), z.literal('')]).optional();
const optStr = z.string().optional();

const members = defineCollection({
  loader: file('src/data/team.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['director', 'postdoc', 'staff', 'phd', 'msc', 'ra', 'intern']),
    status: z.enum(['current', 'alumni']).default('current'),
    photo: optStr,
    email: z.union([z.string().email(), z.literal('')]).optional(),
    years: optStr,
    bio: z.string().default(''),
    interests: z.array(z.string()).default([]),
    links: z
      .object({
        website: optUrl,
        scholar: optUrl,
        linkedin: optUrl,
        github: optUrl,
        orcid: optUrl,
        researchgate: optUrl,
      })
      .default({}),
    /** Other spellings of the name used on papers — used to auto-tag publications. */
    aliases: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

const research = defineCollection({
  loader: file('src/data/research.json'),
  schema: z.object({
    title: z.string(),
    /** Title used on the home page card */
    cardTitle: optStr,
    /** Short name used in menus */
    short: z.string(),
    summary: z.string(),
    /** Paragraphs shown on the research page */
    description: z.array(z.string()).default([]),
    image: z.string(),
    gallery: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

const publications = defineCollection({
  loader: file('src/data/publications.json'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    date: z.union([z.coerce.date(), z.literal('')]).optional().transform((d) => (d === '' ? undefined : d)),
    type: z.enum(['journal', 'conference', 'preprint', 'book-chapter', 'thesis']).default('journal'),
    doi: optStr,
    url: optUrl,
    pdf: optStr,
    members: z.array(reference('members')).default([]),
    projects: z.array(reference('projects')).default([]),
  }),
});

const news = defineCollection({
  loader: file('src/data/news.json'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['event', 'news', 'award', 'paper']).default('news'),
    date: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('')]).optional().transform((d) => (d === '' ? undefined : d)),
    /** Date text exactly as shown, e.g. "June 15th – 17th 2026" */
    dateLabel: optStr,
    summary: optStr,
    location: optStr,
    link: optUrl,
    image: optStr,
  }),
});

/** Projects — currently hidden (see `features.projects` in src/data/site.json). */
const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.array(z.string()).default([]),
    image: optStr,
    area: reference('research'),
    members: z.array(reference('members')).default([]),
    status: z.enum(['active', 'completed']).default('active'),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { members, research, projects, publications, news };
