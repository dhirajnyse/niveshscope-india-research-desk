# GitHub Release Handoff

The GitHub Release Handoff is the final operator room after a NiveshScope build has been packaged. It turns the current release into a practical GitHub update pack: a suggested commit message, release notes, artifact inventory, repository target, live URL, and smoke-test checklist.

## What It Produces

- A commit title and body for the current release.
- A release-note pack that can be copied into a GitHub commit, release description, or operating log.
- A release artifact inventory covering the ZIP package, root files, docs, live URL, repository target, and recovery checkpoint state.
- A JSON handoff export for release history.
- Quick links to the GitHub repository and the cache-busted public GitHub Pages URL.

## Operator Workflow

1. Open the Upload Wizard and confirm the release package and root checklist.
2. Upload the contents inside the release ZIP to the repository root.
3. Wait for GitHub Pages or GitHub Actions to finish.
4. Open the cache-busted live URL and run the Live Site Doctor.
5. Open GitHub Release Handoff.
6. Copy the commit message and release notes.
7. Export the handoff JSON if the release needs a record outside GitHub.

## Why It Exists

The project is now large enough that each release needs a repeatable handoff. Without a handoff, it is easy to upload the right files but forget the exact package name, cache-busted URL, smoke checks, or release rationale. This room keeps the release record close to the product.

## Production Direction

The static handoff is a browser-side launch helper. A production version should connect to a proper CI/CD system that records commit SHA, deploy artifact hash, build logs, GitHub Pages status, Live Site Doctor status, reviewer identity, and immutable release approval events.
