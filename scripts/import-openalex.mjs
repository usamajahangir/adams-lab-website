#!/usr/bin/env node
/**
 * Import publications from OpenAlex into src/data/publications.json.
 *
 *   npm run import:pubs                 # default: works since 2018
 *   npm run import:pubs -- --since 2015
 *   npm run import:pubs -- --dry-run
 *
 * - Lab members are tagged automatically by matching author names against each
 *   member's "name" and "aliases" in src/data/team.json.
 * - Existing entries are never changed, so manual edits are safe.
 *   Duplicates are detected by DOI and by title.
 */
import fs from 'node:fs';
import path from 'node:path';

const AUTHOR_ID = 'A5024053642'; // Ahmed Jawad Qureshi on OpenAlex
const ROOT = path.resolve(import.meta.dirname, '..');
const TEAM = path.join(ROOT, 'src/data/team.json');
const PUBS = path.join(ROOT, 'src/data/publications.json');

const args = process.argv.slice(2);
const since = Number(args[args.indexOf('--since') + 1]) || 2018;
const dryRun = args.includes('--dry-run');

const norm = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/^dr\.?\s+/, '').replace(/[.\-]/g, ' ').replace(/\s+/g, ' ').trim();
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// name + aliases -> member id
const nameToId = new Map();
for (const m of JSON.parse(fs.readFileSync(TEAM, 'utf8'))) {
  for (const n of [m.name, ...(m.aliases ?? [])]) nameToId.set(norm(n), m.id);
}

const pubs = fs.existsSync(PUBS) ? JSON.parse(fs.readFileSync(PUBS, 'utf8')) : [];
const ids = new Set(pubs.map((p) => p.id));
const dois = new Set(pubs.map((p) => p.doi?.toLowerCase()).filter(Boolean));
const titles = new Set(pubs.map((p) => norm(p.title)));

// fetch all pages from OpenAlex
const works = [];
let cursor = '*';
while (cursor) {
  const url = new URL('https://api.openalex.org/works');
  url.searchParams.set('filter', `author.id:${AUTHOR_ID},from_publication_date:${since}-01-01,type:article|review|preprint|book-chapter`);
  url.searchParams.set('per-page', '100');
  url.searchParams.set('cursor', cursor);
  url.searchParams.set('select', 'doi,title,publication_year,publication_date,type,primary_location,authorships');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenAlex ${res.status}: ${await res.text()}`);
  const json = await res.json();
  works.push(...json.results);
  cursor = json.results.length ? json.meta.next_cursor : null;
}

let added = 0;
for (const w of works) {
  if (!w.title) continue;
  const title = w.title.replace(/<[^>]+>/g, '').trim();
  const doi = w.doi?.replace('https://doi.org/', '') ?? '';
  if ((doi && dois.has(doi.toLowerCase())) || titles.has(norm(title))) continue;

  const authors = w.authorships.map((a) => a.author.display_name);
  const members = [...new Set(authors.map((a) => nameToId.get(norm(a))).filter(Boolean))];
  const source = w.primary_location?.source;
  const venue = source?.display_name ?? 'Unpublished';
  const type =
    w.type === 'preprint' ? 'preprint'
    : w.type === 'book-chapter' ? 'book-chapter'
    : source?.type === 'conference' || /procedia|proceedings|conference/i.test(venue) ? 'conference'
    : 'journal';

  let id = `${w.publication_year}-${slugify(title).split('-').slice(0, 6).join('-')}`;
  while (ids.has(id)) id += '-x';

  pubs.push({ id, title, authors, venue, year: w.publication_year, date: w.publication_date ?? '', type, doi, url: '', pdf: '', members });
  ids.add(id); titles.add(norm(title)); if (doi) dois.add(doi.toLowerCase());
  added++;
  console.log(`${dryRun ? '[dry] ' : ''}+ ${id}  [${members.join(', ')}]`);
}

pubs.sort((a, b) => b.year - a.year || (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));
if (!dryRun && added) fs.writeFileSync(PUBS, JSON.stringify(pubs, null, 2) + '\n');
console.log(`\n${added} new publication(s) (checked ${works.length} OpenAlex works since ${since}).`);
