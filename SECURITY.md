# NiveshScope Security Baseline

NiveshScope is currently a static browser prototype. The public app should be treated as a research workflow demo until real data, user accounts, paid feeds, and server-side storage are introduced.

## Current Controls

- Content Security Policy restricts scripts to same-origin files, blocks embedded objects, and only allows the FormSubmit waitlist endpoint for network submission.
- Source URLs are parsed with the browser `URL` API, capped at 2048 characters, and restricted to `http` or `https`.
- Records marked `REAL` require a valid `https://` source URL before entering the live corpus.
- Official source-helper links are normalized before rendering and open with `rel="noopener noreferrer"`.
- Uploaded source files are restricted to `.txt`, `.md`, `.csv`, `.html`, `.json`, and text-based `.pdf` files.
- Browser imports are capped by per-file size, total batch size, and maximum extracted text length.
- User-generated content is escaped before rendering in the interface.
- The static app contains no API keys, broker credentials, paid data tokens, or private user secrets.

## Known Prototype Limits

- Local browser storage is not a secure database. Do not store confidential research, customer PII, broker credentials, or paid data-provider material in this prototype.
- The in-browser PDF extractor is best-effort and is not a malware scanner or OCR pipeline.
- Source URL trust checks help with workflow quality but are not a substitute for server-side allowlists, document hashing, and provenance review.
- Client-side controls can be bypassed by a determined user. Launch-grade enforcement must live on the backend.

## Launch Checklist

- Add authentication, account roles, and workspace-level authorization before saving user data on a server.
- Move source ingestion to a backend service with file scanning, content-type validation, size limits, queueing, and audit logs.
- Store secrets only in server-side environment variables or a secrets manager.
- Add dependency scanning, secret scanning, static analysis, and software composition analysis to CI.
- Add server-side rate limiting and abuse monitoring for uploads, waitlist forms, exports, and future AI calls.
- Keep all generated answers traceable to source document IDs, source URLs, timestamps, and user/workspace IDs.
- Add immutable audit logs for source replacement, data import, report export, and admin changes.
- Add backup, restore, retention, and deletion policies before onboarding customers.
- Run a pre-launch penetration test and review any AI or data-provider vendor security requirements.
- Publish a vulnerability disclosure contact and response process.

## Practical Rule

For demo use, NiveshScope should cite sources and protect the browser surface. For production use, every trust decision must be repeated on the backend.
