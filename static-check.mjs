# Repository Operations

Use this repository as the public GitHub Pages shell until the product needs a backend repository split.

## Upload Rule

When uploading a new release ZIP to GitHub Pages:

- Upload the ZIP contents into the repository root, not inside a nested folder.
- Keep `.nojekyll` in the root so GitHub Pages serves static assets normally.
- Keep `data/`, `assets/`, `app.js`, `index.html`, `styles.css`, and `launch.css` together.
- Keep `SECURITY.md`, `README.md`, and `docs/` in the repository for reviewers and future contributors.

## Version Rule

Each visible release should update:

- Top status pill in `index.html`.
- Cache-busting query strings in `index.html`.
- `DATA_VERSION` in `app.js`.
- README phase notes.

## Quality Rule

Before uploading:

- Run `node --check app.js`.
- Run `node scripts/static-check.mjs`.
- Confirm the app loads on GitHub Pages after a hard refresh.
- Confirm the top status pill shows the latest version.
- Run one research answer and export PDF/Markdown.
- Open Source Studio and confirm helper links still work.

## Branching Rule

For serious development, use branches:

- `main`: deployed GitHub Pages branch.
- `codex/vXX-feature-name`: implementation branch for each release.
- Pull request: review, static checks, screenshot, and release notes.

The current manual ZIP workflow is acceptable for early prototyping, but pull requests will become safer once the project has more users.
