// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.adams-lab.ca',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  // Keep links to the old Wix pages working
  redirects: {
    '/copy-of-industrial-composite-hybrid': '/research/metal-hybrid',
    '/s-projects-basic': '/research/composite-hybrid',
    '/copy-of-industrial-scale-metal-hybrid': '/research/metal-am',
    '/copy-of-research-scale-metal-additive': '/research/pta',
    '/team-1': '/team',
  },
});
