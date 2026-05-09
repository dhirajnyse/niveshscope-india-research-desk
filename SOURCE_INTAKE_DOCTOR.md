# Repository Operations

Use this repository as the public GitHub Pages shell until the product needs a backend repository split.

## Upload Rule

When uploading a new release ZIP to GitHub Pages:

- Upload the ZIP contents into the repository root, not inside a nested folder.
- Keep `.nojekyll` in the root so GitHub Pages serves static assets normally.
- Keep `data/`, `assets/`, `app.js`, `index.html`, `styles.css`, and `launch.css` together.
- Keep `.github/`, `scripts/`, `site.webmanifest`, `robots.txt`, and all docs in the root upload batch.
- Keep `SECURITY.md`, `README.md`, and `docs/` in the repository for reviewers and future contributors.
- Use Launch Control's `Release Doctor` before each manual upload. Copy the root manifest and compare it with the GitHub upload screen before committing.

## Version Rule

Each visible release should update:

- Top status pill in `index.html`.
- Cache-busting query strings in `index.html`.
- `DATA_VERSION` in `app.js`.
- README phase notes.
- Release Doctor package name, manifest text, and static checks when a shipping guard changes.

## Quality Rule

Before uploading:

- Run `node --check app.js`.
- Run `node scripts/static-check.mjs`.
- Confirm the app loads on GitHub Pages after a hard refresh.
- Confirm the top status pill shows the latest version.
- Open Launch Control and confirm Release Doctor says `Root manifest ready`.
- Copy or export the Release Doctor manifest for the release notes.
- Run one research answer and export PDF/Markdown.
- Open Source Studio and confirm helper links still work.

## Branching Rule

For serious development, use branches:

- `main`: deployed GitHub Pages branch.
- `codex/vXX-feature-name`: implementation branch for each release.
- Pull request: review, static checks, screenshot, and release notes.

The current manual ZIP workflow is acceptable for early prototyping, but pull requests will become safer once the project has more users.
