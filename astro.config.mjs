import { defineConfig } from 'astro/config';

// Built for GitHub Pages at https://xinyew.github.io/FUN_OMA_style_homepage/.
// On a custom domain or a <user>.github.io repository, build with BASE_PATH=/
// (and SITE_URL=https://your.domain) so every link drops the repo prefix.
export default defineConfig({
  site: process.env.SITE_URL || 'https://xinyew.github.io',
  base: process.env.BASE_PATH || '/FUN_OMA_style_homepage',
  trailingSlash: 'always',
  build: { format: 'directory' }
});
