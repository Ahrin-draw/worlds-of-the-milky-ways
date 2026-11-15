# Run this GitHub source package

Install Node.js 24, open this folder in VS Code, then run:

```sh
npm ci
npm run dev
```

The package includes source code and a dependency lockfile. It excludes installed packages, the portable Node runtime, local databases, build output, Git history, and local credentials. The source project folders were not changed to make this archive.

Upload the extracted files to a GitHub repository, keeping the folder structure. Include hidden files such as `.gitignore` and `.npmrc`. Do not upload the ZIP itself as your only repository content.

## Current website

Copy `.env.example` to `.env.local` and fill in your SSOJet issuer and public client ID. This SPA does not use a client secret. Register `http://localhost:5174/auth/callback` as the sign-in callback and `http://localhost:5174/` as the login entry in your SSOJet app. The existing sandbox application already has the localhost callback registered.

Open http://localhost:5174/. Login comes before the explorer. Full sign-in-and-return verification remains pending. For a hosted deployment, register its exact public callback URL in SSOJet and supply the public VITE variables at build time.

The NASA image feature uses the public NASA Image & Video Library API without an API key.

## AI generation and deployment

The existing organism generator needs a Cloudflare account connection (`npx wrangler login`). Set `ENABLE_REMOTE_AI=1` when running the current working version with remote AI enabled. Local generation was not verified. See `README.md` for Cloudflare deployment instructions. GitHub stores the code; pushing a repository alone does not publish this server-based application.
