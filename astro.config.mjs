// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The site URL and base path are never hard-coded.
// - Locally they default to the dev server.
// - The GitHub Actions workflow sets SITE_URL and BASE_PATH (see .github/workflows/deploy.yml).
// - For a custom domain, set the SITE_URL repository variable and leave BASE_PATH as "/".
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Astro 7 defaults to JSX-style whitespace, which can eat spaces between inline elements.
  compressHTML: true,
  integrations: [mdx(), sitemap()],
  image: {
    // YouTube thumbnails are downloaded at build time and served from this site,
    // so a visitor's browser never contacts YouTube until they press play.
    domains: ['i.ytimg.com'],
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
