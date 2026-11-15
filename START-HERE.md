# Open your website in VS Code

This folder is a local copy of the existing GitHub project. It is independent of the Base44 editor and may differ from its latest version.

1. Open this folder in VS Code.
2. Choose **Terminal → New Terminal**.
3. Run `npm run dev`.
4. Open the localhost address printed in the terminal.

Or choose **Terminal → Run Task → Start website preview**.

Node.js is included locally in `.tools/node` for this Mac. Packages are already installed.

Edit pages in `src/routes/_site/`, visual components in `src/components/`, and styles in `src/index.css`. Save a file to update the browser preview.

The solar-system pages and planet designer can be previewed locally. The AI generation feature uses Cloudflare Workers AI and requires connecting your own Cloudflare account (`npx wrangler login`, then `ENABLE_REMOTE_AI=1 npm run dev`). The local database is separate from Base44's saved data. Nothing has been deployed or connected to billing.

## Classroom sign-in (working copy only)

Run `npm run dev` and open http://localhost:5174/classroom.
Public SSOJet settings are in the ignored `.env.local`; no client secret is used.
In the SSOJet sandbox application, choose None (Public Client), and register the exact sign-in callback http://localhost:5174/auth/callback and login URL http://localhost:5174/classroom. The portal settings have been saved. Redirecting to the hosted SSOJet login was verified; completing sign-in and the return callback still need user verification.

Authentication uses authorization code with PKCE through oidc-client-ts. Tokens remain in browser session storage. Sign out clears the local website session; it does not terminate the SSOJet provider session. The classroom screen currently contains no private data. Do not add protected records or teacher capabilities without server-side token verification, organization isolation, and role checks. Teacher roles must be assigned by authorized administrators.

Assignments, submissions, Canvas integration, and teacher permissions are not implemented yet.
