# Live Site Doctor

The Live Site Doctor is the post-upload verification room for NiveshScope GitHub Pages releases. It is designed for the exact moment after a release ZIP has been uploaded and GitHub Pages has rebuilt the site. The goal is to answer one practical question: is the public URL serving the right release, with the right root shape, before the link is shared?

## What It Checks

- Whether the app is running as a local preview, the expected GitHub Pages project URL, or an unexpected external or nested path.
- Whether the visible status strip shows the current release marker: `Pilot feedback v61`.
- Whether the styled application shell is present instead of a plain Markdown or JavaScript text dump.
- Whether the main stylesheet, launch stylesheet, and app script are linked from the expected root.
- Whether the company and document data has loaded from the `data/` folder.
- Whether the cache-busted URL includes the current release token.
- Whether the Upload Wizard and Release Doctor remain available for fallback troubleshooting.

## Operator Workflow

1. Upload the contents inside the release ZIP to the GitHub repository root.
2. Wait for GitHub Actions or GitHub Pages to finish publishing.
3. Open the cache-busted public URL from the Live Site Doctor.
4. Confirm the score is high and the status is `Live upload verified`.
5. Copy or export the verification report and keep it with the release notes.

## Failure Signals

The doctor treats these as high-signal deployment problems:

- The page shows source text, Markdown, or unstyled content.
- The status strip still shows an older release marker.
- The browser URL points to a nested package folder instead of the repository Pages root.
- CSS, JavaScript, or `data/*.json` files are missing.
- The page works locally but the live URL is stale because the browser cache was not bypassed.

## Production Direction

The static doctor is intentionally browser-side. In production, the same idea should become an automated deployment monitor that fetches the public URL, validates the release marker, checks asset status codes, verifies `data/documents.json`, records the deploy hash, and stores an immutable verification event for each published release.

