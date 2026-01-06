// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // output: 'server',
    // adapter: netlify(),
    site: 'http://localhost:4321',
    integrations: [sitemap()],
    i18n: {
        defaultLocale: "en",
        locales: ["en", "id"],
        routing: {
            fallbackType: "rewrite",
            redirectToDefaultLocale: true,
            prefixDefaultLocale: false
        }
    }
});
