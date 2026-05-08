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

## Waitlist capture

The waitlist form posts to FormSubmit at `dhirajnyse@gmail.com` and also stores a local browser fallback. On the first live submission, FormSubmit sends an activation email to the destination address. Confirm that email once, then future waitlist submissions will arrive by email.

## Notes

The bundled companies use real Indian listed-company tickers, but the starter disclosures and fundamentals are still synthetic so the prototype is safe to evaluate. Import real annual reports, exchange announcements, concall transcripts, shareholding patterns, rating notes, or model notes before using the workflow for live research. PDF import is best-effort in a static browser app and works best for text-based PDFs; scanned PDFs should be converted to text first. NiveshScope is research software, not investment advice. The valuation panel is a scenario lens, not a price target.

## Live data roadmap

The current public version is intentionally static and uses synthetic starter evidence. The next build should add a refreshable company library for NSE/BSE announcements, annual reports, quarterly results, concall notes, shareholding patterns, and quote or peer-context snapshots while keeping every answer traceable to cited source passages.
