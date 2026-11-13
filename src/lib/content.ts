import { getCollection, type CollectionEntry } from 'astro:content';
import { GROUP_ORDER } from '@/site';

export type Member = CollectionEntry<'members'>;
export type Project = CollectionEntry<'projects'>;
export type Publication = CollectionEntry<'publications'>;

const groupRank = (g: string) => GROUP_ORDER.indexOf(g);

export const sortMembers = (a: Member, b: Member) =>
  groupRank(a.data.group) - groupRank(b.data.group) ||
  a.data.order - b.data.order ||
  a.data.name.localeCompare(b.data.name);

export const sortPubs = (a: Publication, b: Publication) =>
  b.data.year - a.data.year ||
  (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0) ||
  a.data.title.localeCompare(b.data.title);

export async function getMembers() {
  return (await getCollection('members')).sort(sortMembers);
}

export async function getMemberMap() {
  return new Map((await getCollection('members')).map((m) => [m.id, m]));
}

export async function getPublications() {
  return (await getCollection('publications')).sort(sortPubs);
}

export async function getProjects() {
  return (await getCollection('projects')).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) ||
      (a.data.status === b.data.status ? 0 : a.data.status === 'active' ? -1 : 1) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Everything a member is tagged in. */
export async function getMemberWork(memberId: string) {
  const [projects, pubs] = await Promise.all([getProjects(), getPublications()]);
  return {
    projects: projects.filter((p) => p.data.members.some((m) => m.id === memberId)),
    publications: pubs.filter((p) => p.data.members.some((m) => m.id === memberId)),
  };
}

export const initials = (name: string) =>
  name.replace(/^Dr\.?\s+/, '').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export const doiUrl = (doi?: string) => (doi ? `https://doi.org/${doi}` : undefined);

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  d.toLocaleDateString('en-CA', { timeZone: 'UTC', ...opts });
