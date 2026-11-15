import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../site.config';

/** Prefix an internal path with the configured base path (needed on GitHub Pages project sites). */
export function url(p = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = p.startsWith('/') ? p : `/${p}`;
  return `${base}${clean}` || '/';
}

/** Published projects, newest first. Drafts show only in `npm run dev`. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return all.sort(
    (a, b) =>
      Number(a.data.draft) - Number(b.data.draft) ||
      b.data.date.valueOf() - a.data.date.valueOf() ||
      a.data.title.localeCompare(b.data.title),
  );
}

export function formatDate(d: Date, style: 'long' | 'short' = 'long'): string {
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: style === 'long' ? 'numeric' : undefined,
  });
}

/** True when public/resume.pdf exists, so the site never links to a missing file. */
export function hasResume(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', SITE.resumeFile));
}

// Every file inside a project folder, as a built URL. Used for the "downloads" front matter.
const projectFiles = import.meta.glob('/src/content/projects/*/*.{csv,pdf,zip,txt,json,xlsx,step,stl,kicad_pcb,kicad_sch}', {
  query: '?url&no-inline',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function projectFileUrl(entry: CollectionEntry<'projects'>, file: string): string | undefined {
  const folder = entry.filePath ? path.posix.dirname(entry.filePath.replace(/\\/g, '/')) : `src/content/projects/${entry.id}`;
  return projectFiles[`/${folder}/${file}`];
}
