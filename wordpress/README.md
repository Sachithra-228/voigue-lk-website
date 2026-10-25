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

## Applications and candidates' CVs

- Candidates apply from the Careers page (a listed role, or "Send your CV"). Each submission becomes an entry under **Applications** in the admin, with a review status (New, Reviewing, Shortlisted, Interview, Rejected, Hired), and an email alert goes to the careers address in **Voigue > Site settings**.
- **CVs are private.** They are stored in a folder that the website cannot serve, under random file names, and can only be downloaded from the admin by a signed-in user (the link is signed and expires with the session). Deleting an application deletes its CV file.
- Where the folder lives, in order of preference:
  1. `VOIGUE_PRIVATE_DIR` if you define it in `wp-config.php` (for example `/home/youraccount/voigue-private`, a folder above `public_html`).
  2. A `voigue-private` folder next to the website's public folder, if the host allows writing there.
  3. `wp-content/uploads/voigue-private`, protected by an `.htaccess` rule. This works on Apache and LiteSpeed hosts such as Bluehost, but NOT on every server.
- **Before going live, open Voigue > Health check.** "CV storage" must say OK. If it says "Fix this", files in the CV folder can be opened from the internet; set `VOIGUE_PRIVATE_DIR` to a folder above the public one.
- Accepted files: PDF, DOC, DOCX up to 4 MB, checked by their real contents (not just the file name). The server's PHP upload limit must be at least 5 MB (also shown on the Health check page).
- Spam protection: a hidden bot trap, a minimum-time check and a limit of 5 applications per visitor per hour.

> The local test site (`npm run wp:dev`) is not an Apache server, so it deliberately reports "Fix this" for CV storage. That is the check working as intended.

## The Talent Acquisition team

For recruiters who should not touch the rest of the website, the plugin adds a **Talent Acquisition** role.

- **Create a user:** Users > Add New, set Role to "Talent Acquisition".
- **They can:** review applications (change status one by one or in bulk, download CVs, delete), read contact messages, add/edit/publish vacancies, manage Employee Voices, and add gallery photos (choosing from existing categories).
- **They cannot:** edit pages, posts, the theme, plugins, users, Site settings or the Health check, or create new gallery categories. Applications and messages cannot be added by hand; they only come from the website's forms.
- After signing in they land on the Applications list, and their dashboard shows a "Voigue at a glance" summary (new applications, open vacancies, messages) instead of the default WordPress widgets.
- The permissions are created when the plugin is activated or updated. Administrators keep full access.
- The local test site (`npm run wp:dev`) includes a sample TA account (`ta_user`) for trying this out; it exists only in that throw-away site.
