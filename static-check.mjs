# Source Citation Extractor

NiveshScope v46 adds the Source Citation Extractor inside Source Pack Studio. Its job is to reduce the manual work between "I pasted an official filing" and "I have structured source sections that the desk can cite." It reads the pasted source text, ranks candidate passages, maps them to builder sections, and helps the operator fill the source record without turning the original document into an unreviewed blob. In v47, those extracted passages feed the Source Review Gate so the operator can see whether the source is blocked, review-ready, or safe for reviewer handoff.

## What It Checks

The extractor looks for company mentions, numeric evidence, source-type keywords, and section cues. Annual report text is scored for business overview, risk, liquidity, capital, margin, and management discussion language. Concall text is scored for prepared remarks, analyst Q&A, guidance, demand, and margin commentary. Results text is scored for revenue, segment performance, profit, margin, balance-sheet movement, and management commentary. Shareholding and announcement text use their own promoter, pledge, institutional ownership, regulatory, transaction, order, capex, and governance cues.

## Operator Workflow

1. Open Source Pack Studio from the hero or from a source gap.
2. Paste the official source text into the paste assistant.
3. Click `Extract passages`.
4. Review the ranked passages and their target sections.
5. Use `Use passage` for a single citation or `Use best passages` to fill matching builder sections.
6. Run Source Intake Doctor, confirm the source URL and date, then decide whether the record is REAL, imported, or synthetic.

## Export Workflow

`Copy citation pack` and `Export citation pack` create a reviewer-friendly Markdown note with the selected ticker, source type, extraction mode, section coverage, ranked passages, scores, and selection reasons. This is useful when a research assistant, reviewer, or future backend process needs to understand exactly why a passage was selected before it becomes corpus evidence.

## Guardrails

The extractor does not certify that a passage is official. It is a structuring assistant, not a source-verification engine. Source Intake Doctor still checks URL validity, section depth, period/date completeness, REAL confidence checks, and sample-source warnings. Synthetic samples remain labelled as IMP or SYN workflow inputs until a human verifies the document URL, document identity, source date, and relevant citation sections.

## Production Direction

In production, the same workflow should be backed by server-side text extraction, document fingerprinting, OCR confidence, source-provider metadata, reviewer identity, immutable audit logs, a stored citation-span model, and server-enforced Source Review Gate outcomes. The static v46-v47 extractor proves the operator workflow shape first: paste once, extract useful passages, fill structured sections, run the review gate, then save only when the source is ready.
