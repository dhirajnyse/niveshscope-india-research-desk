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
- Phase 16 Coverage Command Center with a company-by-source matrix, filtered gap views, next-gap action, and copyable matrix CSV.
- Phase 17 Coverage CSV Reliability with verified clipboard copy, CSV download, and a manual CSV preview fallback when browser clipboard access is blocked.
- Phase 18 PDF Reports with SEC-desk-style direct PDF export for the current research brief and saved briefs, plus separate Markdown export.
- Phase 19 Real Source Paste Assistant that detects source type, period, title, ticker, and citation sections from pasted annual report, concall, results, shareholding, or announcement text.
- Phase 20 Official Source URL Helper with company IR, NSE, BSE, Screener, and scoped search links beside the paste assistant, plus one-click Source URL fill.
- Phase 21 Security Hardening Baseline with a browser content security policy, validated external source URLs, HTTPS-only REAL source records, upload size limits, and launch security documentation.
- Phase 22 Production Foundation with a visible launch-plan section, architecture docs, data provenance rules, repository operations guidance, and automated static checks.
- Phase 23 Real Source Starter Pack with priority readiness cards for RELIANCE, TCS, and HDFCBANK, source-type replacement actions, and investment-use readiness warnings inside reports.
- Phase 24 Source Collection Assistant with beginner collection steps, explicit `Open source site` and `Fill URL` actions, and progress memory while replacing synthetic sources.
- Phase 25 Real Filing Capture Mode with paste preview, before/after readiness impact, REAL-source verification checks, and one-click training samples.
- Phase 26 Evidence-to-Brief Workbench with memo readiness scoring, evidence/source-gap mapping, packet copy, and packet JSON export.
- Phase 27 Memo Review Room with saved human review decisions, conviction notes, open-risk tracking, and exportable review logs.
- Phase 28 Launch Control Room with launch readiness scoring, blocker routing, company readiness ranking, post-upload tests, and audit pack export.
- Phase 29 Source Intake Doctor with pre-save source quality scoring, REAL-save blocking, citation note copy, URL review, section-depth checks, and sample-source guardrails.
- Phase 30 Investment Readiness Gate with answer-level export posture, blocker checks, next-gap routing, readiness-note copy, and PDF/Markdown gate metadata.
- Phase 31 Decision Journal with research-decision logging, thesis strength, review horizon, trigger criteria, valuation snapshot, exportable journal, and launch-control decision tracking.
- Phase 32 Review Radar with due-date triage, overdue decision alerts, evidence-task follow-up, copy/export radar packs, and Launch Control integration.
- Phase 33 Portfolio Watchtower with company-level readiness scoring, next-action routing, source-gap triage, review-due tracking, and operating-board export.
- Phase 34 Catalyst Calendar with dated research events, review/source/risk/ready filters, next-catalyst routing, and calendar export.
- Phase 35 Daily Briefing with morning/source/review/launch modes, first-action routing, briefing copy/export, and Launch Control integration.
- Phase 36 Desk Task Board with persistent briefing-task capture, task status workflow, route-back actions, copy/export, and Launch Control integration.
- Phase 37 Research Sprint Planner with focus/source/review/launch sprint modes, capacity planning, sprint-task capture, copy/export, and Launch Control integration.
- Phase 38 IC Memo Builder with committee/pilot/source-review formats, gate-aware blocker routing, review and decision trail checks, valuation context, PDF export, JSON export, and Launch Control integration.
- Phase 39 Claim Trace Inspector with answer and IC-memo claim extraction, citation-strength scoring, SYN/unsupported claim warnings, weakest-claim routing, copy/export trace packs, and Launch Control integration.
- Phase 40 Answer Quality Lab with release, citation, committee, and export QA views; blocker scoring; top-fix routing; Markdown/JSON QA reports; and Launch Control integration.
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
- The `Coverage Command Center` gives a matrix view of every company against annual report, concall, results, shareholding, and announcement coverage. Filter to gaps, open the next missing source in Source Pack Studio, or copy the visible matrix as CSV.
- Coverage CSV export now has two paths: `Copy matrix CSV` verifies whether the clipboard copy succeeded, while `Download CSV` saves the same visible matrix as a file. If the browser blocks clipboard access, the CSV appears in a selectable text area.
- Use the top-right `PDF` button after running a report to download a branded research memo. Use `MD` for editable Markdown. Saved briefs also include a `PDF` action in the saved brief card.
- The Source Pack Studio now includes a `Real Source Paste Assistant`: paste raw source text, click `Detect and fill builder`, review the auto-filled source record, add the official source URL, then add it to the live corpus as REAL evidence.
- The paste assistant now shows official source links for the selected company and source type. Use `Open source site` to open NSE/BSE/company pages, `Fill URL` to populate the Source URL field, or `Open hub` to jump into the broader acquisition workspace.
- REAL source records now require a valid `https://` source URL before they can be added to the live corpus. Browser imports are limited to supported text/PDF-style file types and capped by file and batch size to reduce accidental abuse.

## Security baseline

NiveshScope v21 is still a static browser prototype, but it now includes first-line product security controls:

- Content Security Policy in `index.html` limits script execution to same-origin app files and only allows the waitlist endpoint for network submission.
- User-provided source URLs are parsed with the browser `URL` API, length-limited, and restricted to `http`/`https`; REAL records must use `https`.
- Official helper links are normalized before rendering and open with `rel="noopener noreferrer"`.
- Uploaded research files are limited by extension, per-file size, total batch size, and text length before entering the local browser corpus.
- User-entered content is rendered through escaping helpers before insertion into the page.
- No API keys, broker credentials, or paid data-provider secrets are stored in the static app.

See `SECURITY.md` for the launch checklist covering authentication, backend controls, dependency scanning, source provenance, audit logging, and vulnerability handling.

## Production foundation

v22 adds the first durable project foundation around the working desk:

- `docs/ARCHITECTURE.md`: current static architecture and the production service-layer direction.
- `docs/DATA_PROVENANCE.md`: source status rules, required source fields, and review checklist.
- `docs/REAL_SOURCE_STARTER_PACK.md`: priority-company source workflow and readiness levels.
- `docs/SOURCE_COLLECTION_ASSISTANT.md`: beginner workflow for collecting and pasting official source evidence.
- `docs/REAL_FILING_CAPTURE_MODE.md`: filing capture preview, readiness impact, confidence gate, and training sample workflow.
- `docs/BRIEF_WORKBENCH.md`: memo readiness scoring, evidence-to-gap mapping, and packet export rules.
- `docs/MEMO_REVIEW_ROOM.md`: human review workflow, decision log fields, and launch audit direction.
- `docs/LAUNCH_CONTROL_ROOM.md`: launch score inputs, blocker routing, upload checklist, and audit pack structure.
- `docs/SOURCE_INTAKE_DOCTOR.md`: source intake score, REAL evidence blocker rules, and citation-note workflow.
- `docs/INVESTMENT_READINESS_GATE.md`: investment-use posture rules, blocker list, routing actions, and export metadata.
- `docs/DECISION_JOURNAL.md`: research decision ledger, fields, local storage behavior, and production audit direction.
- `docs/REVIEW_RADAR.md`: follow-up workflow for saved decisions, due-date scoring, evidence-task routing, and launch readiness use.
- `docs/PORTFOLIO_WATCHTOWER.md`: daily operating board, company scoring, next-action routing, and portfolio export structure.
- `docs/CATALYST_CALENDAR.md`: dated research operating calendar, event sources, routing rules, and production scheduling direction.
- `docs/DAILY_BRIEFING.md`: morning command workflow, briefing modes, first-action routing, and production briefing direction.
- `docs/DESK_TASK_BOARD.md`: task capture, status workflow, routing, exports, and production task-management direction.
- `docs/RESEARCH_SPRINT_PLANNER.md`: focused sprint planning, capacity rules, task-board/briefing inputs, routing, exports, and production scheduling direction.
- `docs/IC_MEMO_BUILDER.md`: committee memo packet assembly, blocker routing, export behavior, and production investment-committee direction.
- `docs/CLAIM_TRACE_INSPECTOR.md`: claim-level citation tracing, weak-claim routing, exports, and launch-control blocker rules.
- `docs/ANSWER_QUALITY_LAB.md`: answer-level QA scoring, quality dimensions, top-fix routing, exports, and launch-control blocker rules.
- `docs/LAUNCH_ROADMAP.md`: phased path from static proof to source library, accounts, automation, and launch hardening.
- `docs/REPO_OPERATIONS.md`: upload workflow, versioning rules, quality checks, and future branch strategy.
- `scripts/static-check.mjs`: local repository checks for CSP presence, version marker, data JSON validity, and accidental inline handlers.
- `.github/workflows/static-checks.yml`: GitHub Actions workflow for JavaScript syntax and repository static checks.

Before uploading a release ZIP, run:

```bash
node --check app.js
node scripts/static-check.mjs
```

## Real Source Starter Pack

v23 adds a focused MVP trust layer:

- The new `Starter pack` section tracks RELIANCE, TCS, and HDFCBANK first.
- Each company is scored across five required source types: annual report, concall, results, shareholding, and announcement.
- Clicking any source slot opens Source Studio for that exact replacement task.
- Reports now show an `Investment-use readiness` card. Until all required source types are REAL, the answer remains labelled prototype evidence only.
- The readiness path is documented in `docs/REAL_SOURCE_STARTER_PACK.md`.

## Source Collection Assistant

v24 makes the replacement workflow clearer:

- Active replacement tasks now show a five-step checklist: open source site, fill URL, paste source text, detect/review, and add to live corpus.
- Source helper cards now have separate `Open source site` and `Fill URL` controls.
- Opening a source site or filling a URL updates the task progress memory.
- Running `Detect and fill builder` marks the task as pasted/review-in-progress.
- Adding a REAL source marks the task verified through the existing source-progress flow.

## Real Filing Capture Mode

v25 adds a safer final step before evidence enters the corpus:

- `Load sample filing` lets a user learn the flow without using an official source immediately.
- The filing preview detects company, source type, period, useful sections, and readiness impact.
- Before adding evidence, the app shows what changes, such as `Needed -> REAL ready` or `Needed -> IMP review`.
- REAL records require three confirmations: official URL verified, text copied from the same document, and period/date checked.
- Sample text is marked `IMP review` by default so it cannot accidentally look like verified evidence.

## Evidence-to-Brief Workbench

v26 turns a generated answer into a memo packet:

- The `Brief workbench` panel scores whether the current answer is ready for pilot review or still needs evidence work.
- It checks for a generated answer, at least three citations, source-type spread, evidence quality, REAL citation mix, and company-level REAL source coverage.
- The evidence/source map shows which citations were used and which required source slots are still open.
- `Copy memo packet` creates a committee-style Markdown packet with question, brief, readiness checks, evidence, and open gaps.
- `Export packet JSON` saves the same packet as structured JSON for future backend storage.
- `Open next source gap` jumps straight from the memo review to the exact Source Studio replacement task.

## Memo Review Room

v27 adds the human review layer after a memo packet is created:

- Save a review decision such as `Needs source work`, `Pilot memo ready`, `Committee review ready`, `Watchlist only`, or `Reject thesis`.
- Record conviction, owner, review note, and open risk or next action.
- Each saved review stores the memo score, confidence, evidence quality, REAL source coverage, open gaps, and citation metadata.
- Export the full review log as JSON or copy it as Markdown.
- Delete individual review entries or clear the local browser review log.

This is the first step toward a future production audit trail where every research memo has an answer, evidence packet, reviewer decision, and source-gap history.

## Launch Control Room

v28 gives the project one launch cockpit:

- Shows a launch score and status label for the current version.
- Measures REAL source coverage, starter-company readiness, review-log depth, and current memo quality.
- Lists launch blockers and routes the next blocker into the right workflow.
- Ranks companies by required source readiness.
- Provides a post-upload test plan for GitHub Pages releases.
- Exports a launch audit JSON pack with blockers, company readiness, memo packet, review log, and test plan.
- Copies a Markdown upload checklist for manual release tracking.

## Source Intake Doctor

v29 improves the real-data intake workflow inside Source Pack Studio:

- `Check intake` scores the selected company, source URL, source host, citation depth, period/date, sample status, and REAL confidence checks.
- REAL records are blocked if the doctor finds high-priority issues such as missing HTTPS URL, weak citation text, training sample marked REAL, or incomplete confidence checks.
- `Copy citation note` creates a Markdown source intake note with fields, checks, and citation section previews.
- The doctor updates while you paste text, fill URLs, edit sections, change quality, or load sample filings.
- This makes the path from NSE/BSE/company filing to usable source record clearer and harder to misuse.

## Investment Readiness Gate

v30 adds a research-output control between the question form and the answer:

- Scores the active memo as demo, review-only, pilot draft, or committee-ready candidate.
- Checks active answer, citation depth, source spread, evidence quality, confidence, off-ticker drift, REAL citation mix, company source coverage, and human review status.
- Shows the first required blocker and routes the next source gap into Source Pack Studio.
- Copies a Markdown readiness note for review logs or launch checklists.
- Adds gate status and score to PDF/Markdown exports so reports carry their evidence posture.

## Decision Journal

v31 adds a decision ledger after the review room:

- Saves the human research decision attached to the current memo and readiness gate.
- Captures thesis strength, review horizon, next review date, owner, decision note, trigger or kill criteria, and next evidence task.
- Stores the current gate score, memo score, evidence quality, REAL source coverage, and valuation snapshot with each entry.
- Exports the decision journal as JSON or copies it as Markdown for research files.
- Feeds Launch Control with decision-count tracking and a blocker when no decision trail exists.

## Review Radar

v32 turns saved decisions into follow-up work:

- Reads Decision Journal entries and ranks overdue, due, upcoming, scheduled, and unscheduled reviews.
- Shows a follow-up score, due count, overdue count, upcoming count, open evidence tasks, and unscheduled decisions.
- Filters the radar by due reviews, upcoming reviews, or open evidence tasks.
- Opens the next review directly into the right source-replacement workflow when a source gap exists.
- Copies a Markdown radar or exports structured JSON for research operations.
- Feeds Launch Control with review-radar blockers when older conclusions or evidence tasks need attention.

## Portfolio Watchtower

v33 adds a daily operating board above Launch Control:

- Scores every company using REAL source coverage, review state, decision state, risk, and open follow-up pressure.
- Highlights the next company action, such as replacing a source, opening a due review, creating a decision, or refreshing a risk memo.
- Filters companies by source gaps, due reviews, pilot candidates, and high-risk names.
- Sorts by priority, readiness, or risk.
- Copies a Markdown operating board or exports structured JSON for research operations.
- Feeds Launch Control with watchtower score and audit-pack metadata.

## Catalyst Calendar

v34 adds dated research operations:

- Builds catalyst events from Review Radar dates, Portfolio Watchtower source gaps, high-risk companies, and pilot candidates.
- Filters by reviews, source work, risk refreshes, and pilot-candidate check-ins.
- Limits the view to the next 7, 30, 90, or all open days.
- Routes the next catalyst into the right workflow: review follow-up, Source Studio, or a desk question.
- Copies a Markdown calendar or exports structured JSON.
- Feeds Launch Control with calendar score, overdue count, and source-event pressure.

## Daily Briefing

v35 adds a morning command layer:

- Combines Catalyst Calendar, Portfolio Watchtower, and Review Radar into one prioritized action list.
- Switches between morning desk, source sprint, review sprint, and launch prep modes.
- Shows a focus score, urgent-action count, source-work count, review count, and launch posture.
- Routes `Start first action` into the exact source task, review follow-up, portfolio action, or catalyst event.
- Copies a Markdown briefing or exports structured JSON for the daily research file.
- Feeds Launch Control with briefing score, first action, audit-pack metadata, and urgent-action blockers.

## Desk Task Board

v36 turns briefing actions into persistent execution work:

- Captures the first Daily Briefing action or any individual briefing card into a local task board.
- Tracks queued, in-progress, and done statuses with high-priority labels.
- Routes each task back into the right workflow: source work, review follow-up, portfolio action, catalyst event, or desk question.
- Filters open, high-priority, source, review, done, and all tasks.
- Copies the task board as Markdown or exports structured JSON.
- Feeds Launch Control with open-task count, high-priority pressure, done count, and audit-pack metadata.

## Research Sprint Planner

v37 converts open work into a focused research session:

- Builds a sprint from open Desk Task Board items first, then fills remaining capacity from Daily Briefing.
- Supports 90-minute focus, source sprint, review sprint, launch prep, and full-day queue modes.
- Lets the user choose sprint capacity across 3, 5, 8, or 12 actions.
- Captures uncaptured briefing actions into the task board one at a time or as a sprint batch.
- Routes sprint items back into the right workflow and exports the sprint as Markdown or JSON.
- Feeds Launch Control with sprint score, planned count, first action, and audit-pack metadata.

## IC Memo Builder

v38 turns the live desk state into a reviewable committee packet:

- Builds committee, pilot, source-review, and watchlist memo formats from the current answer, gate, valuation lens, review trail, decision trail, and sprint handoff.
- Routes the top blocker back into the exact workflow that needs work.
- Copies Markdown, exports branded PDF, exports JSON, and feeds Launch Control with memo readiness.

## Claim Trace Inspector

v39 checks whether the visible research claims are actually supported:

- Extracts material claims from the current answer or IC memo packet.
- Scores each claim against the current citation stack, highlighting unsupported critical claims and SYN-backed claims.
- Opens the weakest claim directly into evidence review or the next source gap.
- Copies Markdown trace notes, exports JSON trace packs, and feeds Launch Control with a claim-quality score and blockers.

## Answer Quality Lab

v40 adds a release-grade QA console for the current answer:

- Scores active answer, citation depth, evidence quality, REAL source mix, claim support, ticker discipline, readiness gate, review trail, committee packet, and export hygiene.
- Switches between release readiness, citation quality, committee memo, and export hygiene views.
- Opens the top fix into the right workflow instead of leaving the user to guess.
- Copies a Markdown QA report, exports structured QA JSON, and feeds Launch Control with answer-quality score and blockers.

## Waitlist capture

The waitlist form posts to FormSubmit at `dhirajnyse@gmail.com` and also stores a local browser fallback. On the first live submission, FormSubmit sends an activation email to the destination address. Confirm that email once, then future waitlist submissions will arrive by email.

## Notes

The bundled companies use real Indian listed-company tickers, but the starter disclosures and fundamentals are still synthetic so the prototype is safe to evaluate. Import real annual reports, exchange announcements, concall transcripts, shareholding patterns, rating notes, or model notes before using the workflow for live research. PDF import is best-effort in a static browser app and works best for text-based PDFs; scanned PDFs should be converted to text first. NiveshScope is research software, not investment advice. The valuation panel is a scenario lens, not a price target.

## Live data roadmap

The current public version is intentionally static and uses synthetic starter evidence. The next build should add a refreshable company library for NSE/BSE announcements, annual reports, quarterly results, concall notes, shareholding patterns, and quote or peer-context snapshots while keeping every answer traceable to cited source passages.
