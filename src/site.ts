// Site-wide text and contact details are edited in src/data/site.json
import data from '@/data/site.json';

export const FEATURES = data.features;

export const SITE = {
  name: data.name,
  fullName: data.fullName,
  tagline: data.tagline,
  description: data.focus,
  focus: data.focus,
  contactHeading: data.contact.heading,
  contactLead: data.contact.lead,
  contactNote: data.contact.note,
  footerName: data.contact.labName,
  university: data.contact.university,
  building: data.contact.building,
  address: data.contact.address,
  email: data.contact.email,
  mapUrl: data.contact.mapUrl,
};

export const NAV = [
  { label: 'Research', href: '/research' },
  { label: 'Events', href: '/#events' },
  { label: 'Projects', href: '/projects', hidden: !FEATURES.projects },
  { label: 'Publications', href: '/publications' },
  { label: 'Team', href: '/team' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
].filter((n) => !n.hidden);

export const GROUP_LABELS: Record<string, string> = {
  director: 'Director',
  postdoc: 'Postdoctoral Fellows',
  staff: 'Research Staff',
  phd: 'PhD Students',
  msc: 'MSc Students',
  ra: 'Research Assistants',
  intern: 'Co-op Students / Intern',
};

/**
 * Placeholder copy for sections that did not exist on the old site.
 * Search the project for "[Placeholder]" to find everything that still needs real content.
 */
export const PH = {
  short: '[Placeholder] Short intro text for this section goes here.',
  lead: '[Placeholder] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Replace this with a one-sentence introduction.',
  para: '[Placeholder] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  bio: '[Placeholder] Short bio goes here — background, current research and interests. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  interests: ['[Placeholder] Interest A', '[Placeholder] Interest B', '[Placeholder] Interest C'],
  capabilities: ['[Placeholder] Capability A', '[Placeholder] Capability B', '[Placeholder] Capability C', '[Placeholder] Capability D'],
  keywords: ['[Placeholder] Keyword A', 'Keyword B', 'Keyword C', 'Keyword D', 'Keyword E', 'Keyword F'],
};

export const GROUP_ORDER = ['director', 'postdoc', 'staff', 'phd', 'msc', 'ra', 'intern'];
