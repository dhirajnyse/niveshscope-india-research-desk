# Data Provenance Rules

NiveshScope should earn trust by showing where every answer came from. These rules define the minimum source record needed before a document can be used as production evidence.

## Source Status

- `real`: reviewed source from an official company, exchange, regulator, or approved vendor URL.
- `imported`: user-provided source not yet reviewed for public production use.
- `synthetic`: demo-only starter source for product testing.
- `rejected`: source should not be used because provenance, quality, or rights are unclear.
- `expired`: source was valid but is no longer the latest relevant record.

## Required Fields

Every production source record should include:

- Company ticker and legal company name.
- Source type: annual report, concall, results, shareholding, announcement, credit note, model note, or other approved type.
- Period and source date.
- Official source URL.
- Document title.
- Source status and reviewer status.
- Citation-ready sections with concise section titles.
- Capture timestamp and reviewer timestamp.
- Document hash once server-side ingestion exists.
- Rights/licensing note for paid or vendor-provided data.

## Review Checklist

- Does the URL resolve to an official or approved source?
- Is the source relevant to the selected ticker and period?
- Is the document the latest required record for its source type?
- Are the pasted/extracted sections faithful to the document?
- Are management quotes, numbers, and risk language preserved accurately?
- Are synthetic or imported records still clearly labelled?
- Is the answer blocked from using off-ticker sources unless the question is comparative?

## Production Evidence Policy

Do not let a record become `real` only because a user clicked a button. The backend should enforce:

- URL allowlist or approved-source classification.
- File scan and content-type validation.
- Hashing and immutable source storage.
- Reviewer identity and timestamp.
- Audit trail for any source replacement.

## Investor Trust Rule

If NiveshScope cannot show the source, period, citation section, and quality label, it should not present the output as investment-grade research.
