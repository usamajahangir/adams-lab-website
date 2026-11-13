# ADaMS Lab Website

Website of the **Additive Design and Manufacturing Systems (ADaMS) Lab**, University of Alberta.
Built with [Astro](https://astro.build) + Tailwind CSS. All content lives in JSON files in `src/data/`. There is no database.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321 — updates live as you edit
npm run build      # production build into dist/
```

## Editing content

Everything you normally need to change is in **`src/data/`**:

| File | What it holds |
|---|---|
| `site.json` | Lab name, tagline, research-focus text, **contact details** (address, email, map link), feature switches |
| `team.json` | **Team members**: name, role, group, photo, email, bio, interests, links, current/alumni |
| `research.json` | The four **research areas**: titles, summary, description paragraphs, images, gallery, capabilities |
| `publications.json` | **Publication list**, which can also be filled automatically (see below) |
| `news.json` | **News & events** shown on the home page |
| `projects.json` | Projects (currently hidden, see *Feature switches*) |

Each item has an `"id"`. Keep it unique, lowercase and hyphenated (e.g. `"jane-doe"`).
If a value is wrong (bad email, unknown member id, missing required field), `npm run build` stops and names the problem.

### Team member example

```json
{
  "id": "jane-doe",
  "name": "Jane Doe",
  "role": "MSc Student",
  "group": "msc",
  "status": "current",
  "photo": "/images/team/jane-doe.jpg",
  "email": "jane@ualberta.ca",
  "years": "2025 – present",
  "bio": "First paragraph.\n\nSecond paragraph.",
  "interests": ["Wire arc AM", "Machine learning"],
  "links": { "scholar": "", "linkedin": "", "github": "", "orcid": "", "website": "" },
  "aliases": ["J. Doe"],
  "order": 100
}
```

- `group`: `director` · `postdoc` · `staff` · `phd` · `msc` · `ra` · `intern`
- `status`: `current` or `alumni`. Alumni are listed under *Alumni* on the Team page.
- Put square photos in `public/images/team/`. Leave a field as `""` if you don't have it yet.
- `aliases`: other spellings of the name used on papers, so publications get tagged automatically.
- `order`: lower numbers appear first within the same group.

### Tagging members (how profiles fill themselves)

Add member ids to a publication's `"members"` list:

```json
"members": ["ahmed-qureshi", "sajid-ullah-butt"]
```

The publication then appears automatically on each tagged member's profile page (`/team/<id>`).
A typo in an id fails the build, so broken tags are caught before deploying.

### Importing publications

```bash
npm run import:pubs                   # add new papers from OpenAlex since 2018
npm run import:pubs -- --since 2015
npm run import:pubs -- --dry-run      # preview only
```

New papers are appended to `publications.json`, and lab members are tagged by matching author names
to each member's `name` and `aliases`. Existing entries are never changed.

### Feature switches

In `site.json → "features"`:

- `"projects": false` hides the Projects page, menu item, home-page section and profile project lists.
  Set it to `true` and move `src/pages/_projects/` back to `src/pages/projects/` to turn projects on again.

## Placeholder content

Text copied from the old site is used as-is. Anything the old site did not have is filled with
dummy text starting with **`[Placeholder]`**. Search the project for `[Placeholder]` to find it all.
Shared placeholder strings live in `PH` in `src/site.ts`.

## Deploying

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).
Enable it in **Settings → Pages → Source: GitHub Actions**. To serve on `adams-lab.ca`,
add `public/CNAME` containing `www.adams-lab.ca` and point the domain's DNS at GitHub Pages.

Old Wix URLs (`/team-1`, `/s-projects-basic`, …) redirect to the new pages (see `astro.config.mjs`).
