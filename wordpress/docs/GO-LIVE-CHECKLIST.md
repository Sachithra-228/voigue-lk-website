# Go-live checklist

Work through this top to bottom on the live site. Tick each item.

## Setup

- [ ] WordPress 6.2+ and PHP 8.0+ (Voigue > Health check shows both as OK).
- [ ] HTTPS works on the live domain and HTTP redirects to HTTPS (Health check: HTTPS OK).
- [ ] `voigue-core.zip` and `voigue-theme.zip` installed and activated (plugin first).
- [ ] Settings > Reading: "Home" is the front page, "Blog" is the posts page.
- [ ] Settings > Permalinks: "Post name".
- [ ] PHP upload limit is at least 5 MB (Health check: File upload limit OK).

## Candidate privacy

- [ ] `VOIGUE_PRIVATE_DIR` points to a folder above `public_html` (recommended).
- [ ] Health check: **CV storage is OK**.
- [ ] Submit a test application, then try opening the CV file's address while signed out. It must not load.
- [ ] Downloading a CV from Applications works only when signed in.
- [ ] A privacy notice is in place on the Privacy Policy page and linked from the footer.

## Email

- [ ] SMTP plugin installed and connected to a real mailbox.
- [ ] Health check test email arrives in the inbox (not spam).
- [ ] Contact email and Careers email set in Voigue > Site settings.
- [ ] Submit the Contact form: message appears under Messages and the email arrives.
- [ ] Submit a role application and a general CV: both appear under Applications and the careers email gets an alert.

## Content

- [ ] Sample/demo content removed (Health check), real vacancies published.
- [ ] All photo and video slots in Site settings filled (or intentionally left as placeholders).
- [ ] Phone numbers, addresses, social links, map addresses checked.
- [ ] Privacy Policy and Terms of Use contain the approved text (not the placeholder).
- [ ] Life at Voigue YouTube link set, employee voices and gallery photos added.
- [ ] Menus show the right pages; footer links work.

## Quality

- [ ] Check every page on a phone and a desktop: Home, About Us, Life at Voigue, Careers, Contact Us, Blog, a blog post, a missing page (404).
- [ ] Apply for a role: the form opens, rejects a wrong file type and a file over 4 MB, and accepts a PDF/DOC/DOCX.
- [ ] Site title, tagline and favicon set (Appearance > Customize > Site Identity).
- [ ] Search engines allowed (Settings > Reading, "Discourage search engines" unticked).
- [ ] SEO plugin configured (title, description, sitemap).

## Security and access

- [ ] Default `admin` username not used; strong unique passwords.
- [ ] Two-factor authentication on for administrators and Talent Acquisition users.
- [ ] Recruiters created with the **Talent Acquisition** role, not Administrator.
- [ ] WordPress, theme, plugins and PHP are up to date.
- [ ] Backups scheduled and a restore tested; the CV folder is included.

## After launch

- [ ] Monitor Applications and Messages for the first few days.
- [ ] Confirm candidates' emails and spam folder: replies are being received.
