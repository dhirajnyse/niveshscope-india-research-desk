# Release Doctor

NiveshScope v41 introduced a Release Doctor inside Launch Control, v42 kept it as the release-shape guard while adding Operator Coach, v43 kept the same guard while adding Evidence Vault, v44 feeds Release Doctor into Trust Center, v45 keeps the same guard while adding Guided Source Collector, v46 keeps it while adding Source Citation Extractor, and v47 keeps it while adding Source Review Gate. Its job is simple: prevent a good release from being uploaded to GitHub Pages in the wrong shape. The earlier failure mode was a classic static-site issue: the browser could reach the page, but the repository root did not contain the complete application files in the exact structure expected by the HTML shell. When that happens, the public site can look like plain text or an incomplete page even though the code itself is fine.

## What It Checks

Release Doctor runs browser-side checks that should pass after the app has loaded correctly:

- The top status pill shows `Source review v47`.
- `styles.css` is linked from the repository root.
- `launch.css` is linked from the repository root.
- `app.js` is linked from the repository root.
- The Content Security Policy meta tag is present.
- The app data paths point to the root `data/` folder.

These checks do not inspect GitHub directly. They verify that the current loaded page has the right runtime shape, then pair that with a root manifest for the user to compare during manual upload.

## Root Manifest

The manifest lists the files and folders that must be uploaded as repository-root contents:

- `index.html`
- `app.js`
- `styles.css`
- `launch.css`
- `assets/`
- `data/`
- `docs/`
- `scripts/`
- `.github/workflows/static-checks.yml`
- `.nojekyll`
- `README.md`
- `SECURITY.md`
- `site.webmanifest`
- `robots.txt`

The important rule is to upload the contents of the release folder, not the release folder itself as one nested directory.

## Copy And Export

`Copy root manifest` creates a Markdown checklist with the upload rule, required root files, runtime checks, and smoke tests. `Export manifest` creates a JSON version of the same release manifest. The JSON is useful for future automation and for attaching a release record to a pull request or issue.

## Post-Upload Smoke Test

After uploading:

1. Open the GitHub Pages URL with a cache-busting query such as `?v=47`.
2. Confirm the page is styled, not plain HTML text.
3. Confirm the top status pill says `Source review v47`.
4. Open Launch Control and confirm Release Doctor says `Root manifest ready`.
5. Open Trust Center and confirm the score, checks, copy, and export controls render.
6. Open Evidence Vault and confirm the empty research-memory state renders.
7. Run one RELIANCE risk question and confirm the answer panel appears.
8. Save the answer citations into Evidence Vault, then confirm copy/export controls activate.
9. Click `PDF` and `MD` after a generated answer and confirm both downloads start.

## Production Direction

The production version should move these checks into CI and deployment automation. A release pipeline should verify the root manifest, run static checks, upload the built artifact, confirm the deployed page has the latest marker, and archive a signed release manifest. The static Release Doctor is the product workflow shape; production should add branch protection, immutable deployment logs, package checksums, and alerting when the deployed page does not match the expected release marker.
