# Voigue.lk Website

Talent-facing website for Voigue (Pvt) Ltd, built from the "Voigue LK Website Developer Handover" document: Home, About Us, Life at Voigue, Careers, Contact Us, with the Blog linked from the footer. Built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, Zod, React Hook Form, Framer Motion and Vercel Blob.

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Without `MONGODB_URI` the public pages render placeholder vacancies, employee voices and gallery items; forms return a friendly error instead of exposing configuration.

## Swapping in real assets

All photos and videos are placeholders until supplied. Set the matching value in [`src/lib/media.ts`](src/lib/media.ts) (hero clips, team photos, YouTube video ID) and the placeholder is replaced everywhere it is used. Drop files under `public/` and reference them as `/images/...`.

The Voigue wave artwork is supplied separately and is not recreated in code; the footer has a marked slot for it.

## Managing content

- **Vacancies:** sign in at `/admin`, then Jobs. Active jobs appear on Home and Careers within seconds of saving.
- **Applications:** `/admin/applications` lists role applications and general CV submissions; CVs download through an authenticated route. New applications are also emailed to `CAREERS_EMAIL_TO` (default `careers@voigue.com`).
- **CV storage:** `BLOB_READ_WRITE_TOKEN` must belong to a **private** Vercel Blob store so CVs are never publicly reachable.
- **Employee voices / gallery photos:** read from the `Testimonial` and `Moment` collections; admin screens for these are not built yet.
