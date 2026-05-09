# NiveshScope Architecture

## Current Shape

NiveshScope is a static GitHub Pages application:

- `index.html` defines the product surface and research workspace.
- `styles.css` and `launch.css` define the UI system.
- `app.js` handles retrieval, citations, source capture, PDF/Markdown export, local browser storage, and waitlist submission.
- `data/` contains the starter company, question, watchlist, and document corpus.
- Browser storage keeps uploaded documents, source pack records, valuation cases, workspace progress, and saved briefs for the current user/browser.

This is a strong prototype shape because it is fast, cheap to host, easy to review, and transparent. It should not become the final architecture for user accounts, paid data, or private research.

## Production Direction

Keep the static front end as the research desk, but move trust-sensitive work into services:

- Authentication service for users, organizations, roles, and sessions.
- Source ingestion service for uploaded PDFs, annual reports, results, concalls, shareholding patterns, and announcements.
- Provenance database for source records, document hashes, reviewer status, timestamps, and citation sections.
- Retrieval service for semantic search, source filters, ticker guards, and answer evidence packs.
- Report service for branded PDF/Markdown exports and saved memo history.
- Billing service for plans, invoices, limits, and trial state.
- Admin/audit service for ingestion logs, user actions, security events, and support review.

## Data Flow

1. A source is collected from company IR, NSE, BSE, SEBI, or a verified vendor.
2. The ingestion service validates file type, size, source URL, and malware scan result.
3. The source is parsed into sections and stored with immutable provenance.
4. A reviewer marks the source as verified, imported, synthetic, rejected, or expired.
5. The research desk retrieves only eligible source sections for the selected ticker and question.
6. The answer cites source IDs and section IDs, then exports a report with the evidence stack attached.

## Front-End Rules

- Keep answers citation-first.
- Keep user-generated content escaped before rendering.
- Keep source quality labels visible.
- Keep single-company guard behavior visible.
- Keep synthetic data clearly labelled.
- Keep export formats reproducible from stored answer metadata.

## Backend Rules

- Never trust client-side source status, URL, ticker, or citation metadata.
- Repeat file validation and source URL validation server-side.
- Store secrets only server-side.
- Record every source replacement, report export, and admin change.
- Rate-limit uploads, search, report generation, and future AI calls.
- Keep paid data-provider terms separate from open web source handling.
