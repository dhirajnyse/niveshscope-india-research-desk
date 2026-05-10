# Pages Upload Wizard

Pages Upload Wizard turns the GitHub Pages deployment step into a guided product workflow. It exists because a static app can break in confusing ways if the release folder is uploaded as a nested directory, if `index.html` is not at the repository root, or if the cache still serves an older release after GitHub Pages rebuilds.

The wizard combines release metadata, the Release Doctor root manifest, Recovery Vault backup status, and the live GitHub Pages URL. It shows the exact package name, the cache-busting verification URL, the root files and folders GitHub should display, and a four-step upload path: create a restore point, open the release package, upload the contents to the repository root, then verify the live site.

Operators can copy upload steps, copy the root checklist, export a JSON upload plan, or open the live URL. The copied checklist is intentionally plain and operational so it can be pasted into a GitHub commit note, a personal task list, or a release handoff.

This feature is still a static-browser helper. Production deployment should use a CI pipeline that builds the release, validates root assets, publishes to GitHub Pages or a CDN, runs post-deploy smoke tests, records deployment metadata, and blocks releases when required files, security headers, or cache-busting markers are missing.
