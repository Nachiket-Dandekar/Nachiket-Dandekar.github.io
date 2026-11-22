# Nacho Dandekar, personal site

My projects and the numbers I measured. Static site built with Astro, MDX and Tailwind. No backend, no database, no trackers.

## Run it locally

Needs Node.js 22.23 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:4321. Drafts are visible here but not on the live site.

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds the live site into `dist/` |
| `npm run preview` | Serves `dist/` so you can check the build |
| `npm run todos` | Lists every `TODO:` still in the content |
| `npm run check` | Type-checks the code |

## Color looks

There are four color looks: `current`, `topic`, `bold` and `navy`. In `npm run dev`, a switcher at the bottom left lets you flip between them on any page. The live site uses the one set in `LOOK` in `src/site.config.ts`.

## If the dev server shows old content

After changing `src/content.config.ts`, stop the dev server, delete the `.astro` folder, and start it again.

## Add a project

See [ADDING_A_PROJECT.md](ADDING_A_PROJECT.md). Short version: add a folder under `src/content/projects/` with an `index.mdx` and its images.

## Where things are

| Path | What it is |
|---|---|
| `src/content/projects/` | One folder per project, with its images and optional `log.md` |
| `src/content/now/` | The "Working on now" items on the home page, one short file each |
| `src/site.config.ts` | Name, email, GitHub and LinkedIn links, project tags |
| `src/pages/about.astro` | About page text: bio, experience, education, skills |
| `src/assets/profile.jpg` | Your photo (add it; the photo slot shows until then) |
| `public/resume.pdf` | Your resume (add it; the download links appear when it exists) |
| `src/styles/global.css` | Colors, fonts and text styles |
| `src/components/DotField.astro` | The dot background |
| `.github/workflows/deploy.yml` | Build and deploy to GitHub Pages |

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and deploys the site. The URL is `https://<username>.github.io/<repo>/`, or `https://<username>.github.io/` if the repo is named `<username>.github.io`.

The URL is never hard-coded. The workflow works it out from the repository name.

## Add a custom domain later

1. In **Settings > Secrets and variables > Actions > Variables**, add `SITE_URL` with your domain, e.g. `https://example.com`.
2. In **Settings > Pages**, enter the domain under **Custom domain** and follow GitHub's DNS steps.
3. Push to `main` (or re-run the workflow). The site rebuilds for the new domain.

## Privacy

- Fonts are served from this site, not Google.
- YouTube thumbnails are downloaded at build time. The player loads from `youtube-nocookie.com` only after someone presses play.
- No analytics. Ask before adding any.
