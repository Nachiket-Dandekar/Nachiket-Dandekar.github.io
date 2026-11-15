import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAGS } from './site.config';

// One folder per project: src/content/projects/<project-name>/index.mdx plus its images.
// The folder name becomes the URL: /projects/<project-name>/
const projects = defineCollection({
  loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.enum(TAGS)).min(1),
      // Two sentences for the top of the project page.
      summary: z.string(),
      // One short line for the project card. Falls back to the summary.
      blurb: z.string().optional(),
      // Headline numbers. The FIRST one is the big number on the project card.
      stats: z
        .array(
          z.object({
            value: z.string(),
            unit: z.string().optional(),
            label: z.string(),
          }),
        )
        .default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      youtube: z.string().optional(),
      repo: z.url().optional(),
      // Leave false while the repo is private. Set to true to show the GitHub link.
      repoPublic: z.boolean().default(false),
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      // Files in the project folder to offer as downloads, e.g. { label: 'Latency data', file: 'latency.csv' }
      downloads: z.array(z.object({ label: z.string(), file: z.string() })).default([]),
      status: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((d) => !d.cover || !!d.coverAlt, { message: 'coverAlt is required when cover is set', path: ['coverAlt'] }),
});

// Optional build log next to a project: src/content/projects/<project-name>/log.md
// It is published at /projects/<project-name>/log/
const logs = defineCollection({
  loader: glob({
    pattern: '*/log.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string().default('Build log'),
  }),
});

export const collections = { projects, logs };
