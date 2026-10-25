# Installing the Voigue.lk website on WordPress

For the IT team. You need two files, built by `npm run wp:zip` and found in `wordpress/dist/`:

| File | What it is |
| --- | --- |
| `voigue-theme.zip` | The design: all pages, styles and behaviour of the site. |
| `voigue-core.zip` | The plugin: vacancies, applications and CVs, contact messages, site settings, the Talent Acquisition role and the Health check. |

The theme needs the plugin. Install and activate both.

## Requirements

- WordPress 6.2 or newer, PHP 8.0 or newer (8.1+ recommended), HTTPS enabled.
- PHP upload limit of at least 5 MB (`upload_max_filesize` and `post_max_size`). In Bluehost: cPanel > MultiPHP INI Editor.
- The ability to send email (see "Email" below).

## 1. Install

1. Sign in to WordPress as an administrator.
2. **Plugins > Add New Plugin > Upload Plugin**, choose `voigue-core.zip`, install, then **Activate**.
3. **Appearance > Themes > Add New Theme > Upload Theme**, choose `voigue-theme.zip`, install, then **Activate**.

Activating the theme automatically creates the pages (Home, About Us, Life at Voigue, Careers, Contact Us, Blog, Privacy Policy, Terms of Use), the main and footer menus, sets Home as the front page and Blog as the posts page, and turns on "Post name" web addresses. It never overwrites a page or menu that already exists.

## 2. Make the CV folder private (important)

Candidates' CVs must never be reachable from the internet. The plugin looks for a safe folder in this order:

1. The folder named by `VOIGUE_PRIVATE_DIR` in `wp-config.php`. **Recommended on Bluehost:** create a folder above `public_html`, for example `/home/ACCOUNT/voigue-private`, and add this line to `wp-config.php` above the "That's all, stop editing" comment:

   ```php
   define( 'VOIGUE_PRIVATE_DIR', '/home/ACCOUNT/voigue-private' );
   ```

2. A `voigue-private` folder beside the public folder, if the host allows it.
3. `wp-content/uploads/voigue-private`, protected by an `.htaccess` rule (works on Apache and LiteSpeed).

Then open **Voigue > Health check**. **CV storage must say OK.** If it says "Fix this", use option 1.

## 3. Fill in the site

- **Voigue > Site settings**: contact emails, phone numbers, addresses, social links, map addresses, the Life at Voigue YouTube link, and every photo and video slot. An empty slot shows a neutral placeholder, so the site is always presentable.
- **Pages > Privacy Policy / Terms of Use**: contain a placeholder. Replace with Voigue's approved legal text before launch.
- **Vacancies, Employee Voices, Life around here**: add real content (see the Talent Acquisition guide).

To preview the site with sample content, open **Voigue > Health check** and use the demo-content buttons. Use the same page to remove the sample content again before launch.

## 4. Email

The contact form emails the **General email** and applications email the **Careers email** (both in Voigue > Site settings). If either is blank or invalid the site's admin email is used.

Shared hosting often delivers PHP mail to spam. Install an SMTP plugin (for example WP Mail SMTP or FluentSMTP) and connect it to a real mailbox. Then press the test email button on **Voigue > Health check** and confirm it arrives in the inbox.

## 5. Recommended plugins

These are not required, but we recommend:

- **SMTP**: WP Mail SMTP or FluentSMTP (reliable email delivery).
- **Backups**: UpdraftPlus or the Bluehost backup tools. The CV folder must be included; if it is above `public_html`, back it up separately.
- **Security**: Wordfence or Solid Security, with two-factor authentication for administrators and Talent Acquisition users.
- **SEO**: Yoast SEO or Rank Math.

## Updating

To release a new version: build new zips, then upload them over the old ones (Plugins > Add New > Upload, then "Replace current with uploaded"; same for the theme). Content, settings, applications and CVs are kept. Version numbers live in `voigue-core/voigue-core.php` (`VOIGUE_CORE_VERSION`) and `voigue-theme/style.css` / `functions.php`. Roles are refreshed automatically when the plugin version changes.

## Uninstalling

Deactivating the plugin hides the vacancies, applications and messages screens but keeps the data. The CV folder is not deleted automatically.
