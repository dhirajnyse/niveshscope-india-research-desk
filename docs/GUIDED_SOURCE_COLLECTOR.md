# Guided Source Collector

NiveshScope v45 adds a Guided Source Collector above Source Pack Studio. The purpose is to remove operator confusion when the source workflow has many panels: the collector picks one source task, shows the official collection route, and keeps the user focused until the record is ready for the live corpus. In v46, the selected task can flow into the Source Citation Extractor so pasted filing text becomes ranked, section-ready passages before it reaches the builder. In v47, the same task then flows through the Source Review Gate before REAL evidence can be saved.

## What It Does

- Reads the same company/source coverage matrix used by the Source Queue and Coverage Command Center.
- Prioritizes missing, synthetic, and imported evidence before REAL evidence.
- Gives the starter pack priority so RELIANCE, TCS, and HDFCBANK move toward launch-quality coverage first.
- Shows one active task with current evidence, official source links, and a checklist tied to the builder form.
- Copies or exports a Markdown source brief that can be handed to a research assistant.

## Priority Logic

The collector ranks source work in this order:

1. Missing source slots.
2. Synthetic starter records that should be replaced before investment-use pilots.
3. Imported review records that should be upgraded to REAL.
4. REAL records, only when nothing else is open.

Within the same status bucket, starter-pack companies are ranked before the broader watchlist. Results, annual reports, concalls, shareholding patterns, and announcements then follow the product's current collection priority.

## Operator Flow

1. Open `Source guide` from the hero or scroll to Source Pack Studio.
2. Read the chosen source task and current evidence state.
3. Click `Load next source task` to set the company, source type, period, title, and REAL quality in the builder.
4. Click `Open official links` to view the same task in the Source Acquisition Hub.
5. Open NSE, BSE, Company IR, Screener, or scoped search from the link list.
6. Paste useful source text into the Real Source Paste Assistant.
7. Click `Detect and fill builder`.
8. Run the Source Intake Doctor and confirm the three REAL source checks.
9. Click `Add to live corpus`.

## Checklist Signals

The collector checklist is intentionally simple:

- Task loaded.
- Official URL filled.
- Source text pasted.
- Builder sections detected.
- Source Intake Doctor has no high-priority blockers.
- REAL save checks are confirmed.

The checklist does not replace human review. It is a browser-side operator aid that makes the desired workflow visible.

## Production Direction

In production, this should become an assigned source-work queue backed by server-side records. Each task should store owner, reviewer, source URL, document fingerprint, source-provider metadata, source status, extracted citation spans, Source Review Gate score, and immutable transition history. The static v45-v47 collector proves the workflow shape before adding backend enforcement.
