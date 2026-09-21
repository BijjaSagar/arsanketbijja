# Sanket Bijja — Architecture Portfolio

Next.js 16 portfolio with a small admin CMS (Prisma + SQLite). The public design is unchanged; content, images, and projects are editable from `/admin`.

## Admin

- URL: `/admin/login` (then `/admin`)
- Credentials come from environment variables, not from the repo:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - `SESSION_SECRET` (long random string, 32+ characters)
- The first boot seeds one admin user from those values. Changing them on the server and restarting updates the login.

**Change the production password.** Do not use the local development password on Hostinger.

## Hostinger (production)

This app is a **Node.js** app, not a static export. Do **not** use output directory `out`.

In the Hostinger dashboard:

| Setting | Value |
| --- | --- |
| Package manager | **npm** |
| Build command | `npm run build` |
| Start command | `npm start` |
| Output / application directory | **`.next`** (Node.js app) |
| Node version | 20+ |

Environment variables to set in Hostinger:

```
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=a-strong-unique-password
SESSION_SECRET=a-long-random-string
DATABASE_URL=file:../data/cms.db
```

`DATABASE_URL` is relative to `prisma/schema.prisma` and creates `data/cms.db` at the project root.

### Persist CMS data across deploys

Keep these on the server (they are gitignored):

- `data/` — SQLite database (`cms.db`)
- `public/uploads/` — images uploaded in the admin

If a clean deploy wipes the project folder, admin edits and new uploads are lost and the site will re-seed from the original portfolio content.

First deploy auto-seeds profile copy and existing projects from `lib/data.ts`, so the live site is not empty.

## Local development

```bash
cp .env.example .env
# edit ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + `prisma db push` + `next build` |
| `npm start` | Production server (`next start`) |
| `npm run db:seed` | Seed admin, site content, and projects if empty |
| `npm run db:push` | Apply Prisma schema to SQLite |

## Stack

- Next.js App Router
- Prisma + SQLite
- httpOnly JWT cookies (`jose`) + `bcryptjs`
- Uploads stored under `public/uploads/`
