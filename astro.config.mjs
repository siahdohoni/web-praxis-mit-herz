// @ts-check
import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: "https://www.praxismitherz.de",
  integrations: [mdx()],
  redirects: {
    '/über-mich.html': '/über-mich/',
    '/kontakt-und-anfahrt.html': '/kontakt/kontakt-und-anfahrt/'
  }
});