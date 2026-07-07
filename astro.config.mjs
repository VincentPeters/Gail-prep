// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://vincentpeters.github.io/Gail-prep/
// `site` + `base` make all internal links resolve correctly under the repo subpath.
export default defineConfig({
  site: 'https://vincentpeters.github.io',
  base: '/Gail-prep',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
