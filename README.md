# NiveshScope

Evidence-backed Indian equity research for investors who want cited answers instead of headline summaries. NiveshScope lets users ask complex questions across annual reports, NSE/BSE announcements, concall transcripts, shareholding patterns, credit notes, and valuation scenarios.

## What is included

- Client-side retrieval over a synthetic Indian-market disclosure corpus.
- Phase 3 starter watchlist: RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, SBIN, TATAMOTORS, LT, BAJFINANCE, and ADANIENT.
- Phase 5 data architecture with `data/companies.json`, `data/documents.json`, `data/questions.json`, and `data/watchlists.json`.
- Source-ranked answers with citation cards, confidence scoring, and management-tone read-throughs.
- Risk questions return exactly three cited risk factors with severity labels.
- India-style ticker aliases such as `$RELIANCE`, `$TCS`, `$HDFCBANK`, and `$TATAMOTORS`.
- Company filters, document toggles, text/file import, saved briefs, copy-to-clipboard, and Markdown export.
- Phase 2 company dossier with KPI summary, document timeline, source mix, risk checklist, and one-click research questions.
- Import report for pasted/uploaded documents, including section count, metric count, ticker coverage, and skipped-file feedback.
- Browser-side import for `.txt`, `.md`, `.csv`, `.html`, `.json`, and best-effort text-based `.pdf` files.
- Guided import that lets users choose the company and source type before adding a document.
- Visible source-quality labels for `synthetic`, `imported`, and `real` evidence.
- Phase 6 Source Pack Studio for creating verified source records in the browser and exporting source-pack JSON.
- Phase 7 real-source collection workflow with source-pack JSON import, full `documents.json` export, and per-company real-data checklists.
- Phase 8 real-source starter queue with collection tasks, status filters, Source Pack Studio handoff, and CSV export.
- Phase 9 Source Acquisition Hub with company IR links, NSE/BSE collection links, selected-task copy, and Markdown task-list export.
- Phase 10 Real Data Workspace with local task progress, today's batch, progress CSV export, and workspace JSON export.
- Phase 11 Evidence Quality Guard with strict single-company citation control, evidence quality scoring, and mismatch warnings.
- Phase 12 Brief Hygiene with guarded saved notes, proper ticker metadata, per-note delete, and compact saved brief detail view.
- Phase 13 Real Source Upgrade Pack with completeness scoring, one-click checklist upgrades, stronger SYN warnings, and clearer demo-only evidence labels.
- Phase 14 Live Source Capture Polish with an active replacement-task banner, sticky Source Studio actions, and a return-to-dossier flow after saving.
- Phase 15 Source Export Readiness with builder-pack quality counts, upload guidance, and a clear `data/documents.json` shipping path.
- INR crore valuation lens with revenue CAGR, FCF margin, terminal multiple, and discount-rate sensitivities.
- Saved valuation cases stored locally in the browser.
- One-click research outputs for risk memos, concall tone, valuation assumptions, peer comparison, and investment committee briefs.
- Signal map for growth, margin, and risk across the selected coverage universe.
- Launch hero, data roadmap, pricing plans, static waitlist capture, and roadmap sections.
- A 3D-style SVG brand mark in `assets/niveshscope-logo.svg`.
- Launch metadata with favicon, web app manifest, and social preview artwork.

## Product positioning

Name: NiveshScope

Tagline: Ask Indian disclosures. See the evidence.

Audience: Indian retail investors, active market participants, and finance professionals who want an affordable research workflow for listed Indian companies.

Suggested SaaS packaging:

- Starter: Rs 799/month for saved briefs and limited imports.
- Pro: Rs 1999/month for broader coverage and scenario exports.
- Desk: Rs 3999/month for alerts, watchlists, and repeatable coverage workflows.

## Open the app

Open the deployed GitHub Pages URL. Because v5 loads JSON from the `data/` folder, local `file://` opening may be blocked by browser fetch rules. For local testing, use any small static web server from the project root.

## Data architecture

The application shell is in `index.html`, `styles.css`, `launch.css`, and `app.js`. The research universe now lives in `data/`:

- `data/companies.json`: Companies, model assumptions, thesis text, and risk-factor templates.
- `data/documents.json`: Starter source sections used by retrieval.
- `data/questions.json`: Left-rail question templates.
- `data/watchlists.json`: Watchlist definitions and ticker aliases.
- `data/source-pack-template.json`: Copyable template for adding real annual reports, concalls, results summaries, shareholding extracts, and NSE/BSE announcements.

## Source Pack Studio

The `Source Pack Studio` section lets you create real evidence records without editing JSON by hand:

- Select company, source type, quality, period, date, and source URL.
- Paste section text using source-type templates.
- Add the record to the live browser corpus for immediate research.
- Export the builder pack as JSON.

The exported JSON can be reviewed and merged into `data/documents.json` when the source is ready to ship with the public app.

v7 and v8 add a repeatable collection workflow:

- Import a previously exported source-pack JSON file back into the browser.
- Export only builder records for review.
- Export the full merged `documents.json` with starter, builder, and uploaded records.
- Use each company dossier checklist to see whether annual report, concall, results, shareholding, and announcement records are still synthetic, imported, real, or missing.
- Use the `Real Source Queue` to filter missing or synthetic records, open the next task in Source Pack Studio, and export the full collection checklist as CSV.
- Use the `Source Acquisition Hub` to open official company, NSE, and BSE source pages, copy a clean collection task, or export a priority task list for a research assistant.
- Use the `Real Data Workspace` to run a focused collection batch and mark each task as queued, collected, pasted, or verified. Progress is stored locally in the browser and can be exported as CSV or as a workspace JSON pack with documents and progress.
- Use the `Only selected ticker` evidence guard before running single-company questions. Unless the question is explicitly comparative, retrieved citations stay anchored to the selected ticker and the answer shows an evidence quality score plus mismatch warning.
- Saved briefs now use the answer's guarded ticker focus rather than the first citation. Notes show confidence, evidence quality, guard status, can be opened into a detail view, and can be deleted individually.
- Each company dossier now shows a real-source completeness score. Use `Upgrade next source` or each checklist item's `Replace with REAL` button to open Source Pack Studio for the exact annual report, concall, results, shareholding, or announcement source that still needs replacement. SYN citations are labelled demo-only in answers and evidence cards.
- Source Pack Studio now keeps the selected replacement task visible at the top of the form, keeps builder actions reachable while scrolling, and provides `Return to dossier` after adding a source so completeness can be checked immediately.
- Builder Pack now shows export readiness before shipping: REAL/IMP/SYN counts, missing source URLs, section counts, and the exact GitHub upload target. Use `Export source pack` for review, or `Export full documents.json` when you are ready to replace `data/documents.json` in the repository.

## Waitlist capture

The waitlist form posts to FormSubmit at `dhirajnyse@gmail.com` and also stores a local browser fallback. On the first live submission, FormSubmit sends an activation email to the destination address. Confirm that email once, then future waitlist submissions will arrive by email.

## Notes

The bundled companies use real Indian listed-company tickers, but the starter disclosures and fundamentals are still synthetic so the prototype is safe to evaluate. Import real annual reports, exchange announcements, concall transcripts, shareholding patterns, rating notes, or model notes before using the workflow for live research. PDF import is best-effort in a static browser app and works best for text-based PDFs; scanned PDFs should be converted to text first. NiveshScope is research software, not investment advice. The valuation panel is a scenario lens, not a price target.

## Live data roadmap

The current public version is intentionally static and uses synthetic starter evidence. The next build should add a refreshable company library for NSE/BSE announcements, annual reports, quarterly results, concall notes, shareholding patterns, and quote or peer-context snapshots while keeping every answer traceable to cited source passages.
