# Hack the Nest submission readiness

This report describes the working copy. The original folder has not been edited.

| Track | Evidence and remaining step |
|---|---|
| Beyond the Horizon | The educational site now queries the NASA Image & Video Library API for Mars, the Sun, and Jupiter. NASA metadata, image credits, record links, and API documentation are displayed. Live API responses and handler validation were checked. |
| Best Use of SSOJet | A sign-in screen appears before the site. The existing sandbox SPA uses authorization code + PKCE, a localhost callback, session restoration, and local sign-out. Complete an actual sign-in and callback in Chrome before claiming a fully verified flow. No private classroom records are stored; server-side authorization is required before adding them. |
| Best Beginner | The user confirmed that most team members are first-time hackathon participants. State this in the submission. |
| Department of Computer Science | Prepare the code repository and explain the scroll-driven particle interpolation, seamless planet reveal, single-topic information panels, validated/cached NASA data handler, and OIDC integration. Build and lint pass; judging is the organizers’ decision. |
| Best Use of Base44 | Preserve evidence of the original Base44 project and its published URL. Confirm with organizers that an exported, customized implementation counts. The customized local version still needs a public deployment for a shareable demo. |

## References

- Official tracks: https://hackthenest.tech/#tracks
- NASA track: https://hackthenest.tech/#track-astronomy
- NASA API documentation: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf

## Local demo

Open http://localhost:5174/. Choose Sign in to explore and finish the SSOJet email sign-in. After the callback, the home page shows the formation animation. Scroll to explore planets, read the NASA observations, and open a dossier.

The formation scroll distance was shortened from 2.2 to 1.3 viewport heights. The exploration interval remains, and the rest of the design is retained.

NASA data is public and cached for 15 minutes per topic. External-service failures show a retry and a link to NASA rather than fabricated images or facts.

SSOJet browser testing was interrupted by an automatic approval service usage-limit failure. The welcome screen was verified locally, but the hosted sign-in and return callback still require completion.

The existing organism generator uses Cloudflare Workers AI; real generation still requires the Cloudflare account connection described in README.md.
