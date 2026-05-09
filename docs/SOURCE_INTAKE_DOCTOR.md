# Source Intake Doctor

NiveshScope v29 adds a source-quality check inside Source Pack Studio. The feature is meant to prevent weak, mismatched, or accidentally synthetic evidence from entering the live corpus as REAL evidence.

## What It Checks

The Source Intake Doctor reviews the current builder state:

- Selected company and whether the source text appears to mention that company.
- Source URL validity, HTTPS use, and trusted-host status.
- Citation section depth and total pasted text.
- Period, date, and record title completeness.
- Whether a training sample is accidentally marked as REAL.
- The three REAL source confidence checks.

Each item is scored as OK, warning, or high-priority blocker.

## REAL Save Blocking

The doctor blocks REAL saves when high-priority issues remain. Examples:

- Missing or invalid HTTPS source URL.
- No meaningful citation sections.
- Training sample marked as REAL.
- REAL confidence checklist not complete.

Imported and synthetic draft records can still be used for workflow testing, but they remain labelled as IMP or SYN.

## Citation Note

`Copy citation note` creates a Markdown source intake note with:

- Company.
- Source type.
- Quality label.
- Period and date.
- Source URL.
- Intake score.
- All doctor checks.
- Previewed citation sections.

The note is useful when a research assistant, reviewer, or future backend process needs to understand exactly what was captured and what still needs verification.

## Production Direction

The static version checks source quality in the browser. A production version should move these checks into a backend ingestion pipeline with:

- File hash and source URL fingerprinting.
- Document ID and source-provider metadata.
- OCR/text extraction confidence.
- Antivirus and malware scanning for uploads.
- Reviewer identity and approval state.
- Immutable audit logs for every source transition.

The v29 doctor is the product workflow shape; production should add stronger enforcement and storage.
