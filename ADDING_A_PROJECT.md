# Adding a project

Each project is one folder. Add the folder, and the site does the rest: the home page, the Projects page, the tag filter and the project page all update on their own.

## Steps

1. Copy `templates/project/` to `src/content/projects/your-project-name/`.
   The folder name becomes the URL, for example `/projects/your-project-name/`. Use lowercase words and dashes.
2. Put the images for the project in that same folder. Name the main photo `cover.jpg` (or change `cover:` to match).
   Use the full-size photos. The site resizes and compresses them when it builds, and removes hidden data like GPS location from phone photos.
3. Edit `index.mdx`: fill in the front matter at the top, then write the sections.
4. Run `npm run dev` and open http://localhost:4321 to check it. Drafts show there with a "draft" label.
5. When it is ready, set `draft: false`, then commit and push to `main`. GitHub builds and deploys the site.

That's it. You never need to edit any other file.

## Front matter

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Project name. |
| `date` | yes | `YYYY-MM-DD`. Projects are listed newest first. |
| `tags` | yes | One or more of `FPGA`, `PCB`, `embedded`, `software`. |
| `summary` | yes | Two sentences at the top of the project page. |
| `measured` | no | One line under the numbers on how you measured them. |
| `blurb` | no | One line for the card. Falls back to `summary`. |
| `stats` | no | Headline numbers. The first one is the big number on the card. Each has `value`, optional `unit`, and `label`. |
| `cover` | no | Card and page image, e.g. `./cover.jpg`. |
| `coverAlt` | with `cover` | Alt text for the cover. The build fails without it. |
| `youtube` | no | YouTube video id (the part after `watch?v=`). Leave it out to show a "coming soon" placeholder. |
| `repo` | no | GitHub link. |
| `repoPublic` | no | `false` hides the link and shows "private for now". Set to `true` when the repo is public. |
| `downloads` | no | Files in the project folder to offer, e.g. `{ label: 'Raw data (CSV)', file: data.csv }`. |
| `links` | no | Other links, e.g. `{ label: 'Datasheet', href: 'https://...' }`. |
| `status` | no | Short note on the card, e.g. `in progress`. |
| `fix` | no | One fix shown on the card, red to green, e.g. `{ label: 'Worst timing slack at 100 MHz', before: '-6.263 ns', after: '+0.424 ns' }`. |
| `featured` | no | `true` shows it on the home page. |
| `draft` | no | `true` hides it on the live site. |

## Page sections

The page always runs in this order:

1. Summary and headline numbers (from the front matter)
2. Video (from `youtube`)
3. Your `##` sections, numbered in order. Use these:
   - `## Why I built it`
   - `## How it works`
   - `## What went wrong and what I optimized`
   - `## Results`
   - `## What I would do next` (optional: leave it out for a finished project, like a class project)
4. Links (from `repo`, `downloads`, `links`, and the build log)

The numbers update on their own, so leaving a section out never leaves a gap.

To list sources, like the pages you used for a presentation, add them under `links:` in the front matter. They show up in the Links section.

Use `###` for smaller headings inside a section.

## Things you can use in the text

Normal Markdown works: paragraphs, lists, tables, `code`, and code blocks with three backticks.

These components work in any project file without an import:

**A photo with a caption.** Import the image at the top, under the front matter:

```mdx
import board from './board.jpg';

<Figure src={board} alt="What the photo shows" caption="One sentence about it." />
```

Add `wide` to let it grow wider than the text, or `maxHeight={500}` to crop a tall photo.

**Before and after numbers.** Before is red, after is green.

```mdx
<BeforeAfter rows={[
  { label: 'Worst slack at 100 MHz', before: '-6.263 ns', after: '+0.424 ns' },
]} />
```

**A data path or block diagram.**

```mdx
<Pipeline steps={[
  { name: 'adc', note: 'Samples the input at 1 MHz', group: 'Input' },
  { name: 'filter', note: 'FIR, 32 taps', group: 'Processing' },
]} />
```

`group` is optional. It adds a small label each time the group changes.

**A chart from a CSV file in the project folder.**

```mdx
import data from './latency.csv?raw';

<PointChart csv={data} y="latency_cycles" scale={10} unit="ns" log
  title="Latency of each order" xLabel="order"
  caption="One sentence about the chart." />
```

`y` is the column to plot. `scale` multiplies it (10 turns 100 MHz cycles into ns). Add `groups` to split points by a rule, and `reference` for a dashed line. See the tick-to-trade project for a full example.

## Colors

The site is navy, white and blue-gray. A few colors carry one meaning each:

| Color | Meaning |
|---|---|
| Red | A problem, or a "before" number |
| Green | A fix, or an "after" number |
| Teal, purple, orange, pink, fuchsia | Topic dots in "Working on now": FPGA, ASIC, PCB, embedded, software |

Links are white and underlined.

In charts, use `color: 'ink'` (gray) for normal points and `color: 'red'` only for points that show a problem.

## Build log (optional)

Add `log.md` to the project folder. It is published at `/projects/your-project-name/log/` and linked from the project page. Start it with:

```md
---
title: Build log
---
```

Use `./image.png` for images so they get resized too.

## Working on now

The "Working on now" list on the home page is separate from projects. Each item is one short file in `src/content/now/`:

```md
---
title: Custom FPGA board
stage: Coming soon
topic: PCB # sets the dot color: FPGA, ASIC, PCB, embedded or software
order: 2
# link: { label: The project, href: /projects/your-project-name/ }
---

One to three sentences on what you are doing.
```

`order` sets the position (lower first). Delete the file when it is done, or turn it into a project.

## Checking for missing text

Run `npm run todos` to list every `TODO:` left on the site.

## Writing style

First person, simple words, short sentences. Only real numbers you measured.
