# Voigue.lk for WordPress

The Voigue.lk design as a WordPress theme plus a companion plugin. Same design and copy as the Next.js version in `src/`.

| Folder | What it is |
|---|---|
| `voigue-theme/` | The look: header, footer, pages, styling, animations. Replaceable without losing data. |
| `voigue-core/` | The data and tools: vacancies, site settings (contact details, photos, videos), health check. Keep it active at all times. |
| `dev/blueprint.json` | Recipe for the local test site (WordPress Playground). |

## Try it locally (no PHP, Docker or MySQL needed)

```bash
npm install
npm run wp:css      # builds the theme stylesheet (re-run after changing templates or src/input.css)
npm run wp:dev      # starts a test WordPress at http://127.0.0.1:9400 with the theme and plugin active
```

Log in at `http://127.0.0.1:9400/wp-admin` with `admin` / `password` (test site only). Then open **Voigue > Health check** and click **Create demo vacancies** to fill the careers carousel.

While editing templates, keep `npm run wp:css:watch` running in a second terminal.

## How the setup works

Activating the theme runs `voigue_theme_activate()` (in `voigue-theme/inc/setup.php`). It creates the six pages, the two menus, the "Home" and "Blog" reading settings and pretty permalinks, and never overwrites pages or menus that already exist. Activate it on a **new or staging** WordPress, not directly on a live site that already has pages called Home, About Us, and so on.

## Regenerating the globe

`scripts/generate-globe.mjs` (project root) produces both the Next.js globe data and `voigue-theme/template-parts/globe.php`. Edit the places or the view there, then run `node scripts/generate-globe.mjs`.

## Photos and videos

Nothing is hard-coded. Every slot lives in `voigue-core/includes/defaults.php` (`voigue_media_slots()`) and is filled in under **Voigue > Site settings**. An empty slot shows a neutral placeholder.
