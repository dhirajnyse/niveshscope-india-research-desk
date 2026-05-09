# Source Review Gate

NiveshScope v47 adds the Source Review Gate inside Source Pack Studio. The gate is the final reviewer checkpoint between pasted source work and the live research corpus. It combines the existing paste assistant, citation extractor, Source Intake Doctor, URL trust rules, section coverage, and REAL confidence checklist into one pass/review/block decision.

## What It Checks

- Source identity: company, source type, period, date, and record title must be complete.
- Official source URL: REAL evidence must use a valid HTTPS URL from a trusted company, exchange, regulator, or market-data source.
- Company discipline: the pasted text or sectioned evidence must clearly mention the selected company or ticker.
- Citation structure: enough builder sections must contain meaningful source text before the source is saved.
- Citation extractor: extracted passages and section coverage are reviewed for handoff quality.
- Intake Doctor: high-priority intake blockers remain binding before REAL save.
- REAL confidence: the operator must confirm source URL, exact document match, and period/date match before verified evidence enters the corpus.
- Sample guard: training samples cannot be marked as REAL evidence.

## Operator Workflow

Use Source Pack Studio in this order:

1. Pick the company and source type, or load a task from the starter pack, coverage map, source queue, or acquisition hub.
2. Open the official source link and paste only the relevant citation sections into the paste assistant.
3. Run `Detect and fill builder`, then use the citation extractor to fill or refine structured source sections.
4. Add the official Source URL and complete the REAL confidence checklist when the source is genuinely verified.
5. Click `Run review gate`. If blocked, use `Open first fix` to jump directly to the missing or unsafe field.
6. Copy or export the review sheet for human handoff before saving high-value sources into the live corpus.

## Save Blocking

The static app now blocks REAL saves when the Source Review Gate finds high-priority blockers. This protects against the most dangerous workflow mistakes in a research product: wrong-company evidence, missing or unsafe source URLs, shallow citations, sample text accidentally treated as real, or a REAL record without explicit reviewer confidence checks.

Imported and synthetic drafts can still be used for workflow testing, but they remain clearly labelled and should not be treated as investment-ready evidence. The investment-readiness and answer-quality gates continue to warn when an answer depends on SYN or review-only sources.

## Reviewer Output

`Copy review sheet` and `Export review sheet` produce a Markdown record containing:

- Release label and generation timestamp.
- Company, source type, quality label, period, date, and Source URL.
- Overall gate score and pass/review/block status.
- Every check with its result and explanation.
- Extracted citation passages, when available.

This note is useful for a research assistant, reviewer, or future backend ingestion process because it explains exactly what was captured and what still needs verification.

## Production Direction

The browser gate proves the product workflow shape. A production version should move enforcement server-side with authenticated reviewers, immutable source-transition logs, document fingerprints, source-provider metadata, OCR/text extraction confidence, antivirus scanning for uploads, and approval state before any source record can be used in published research.
