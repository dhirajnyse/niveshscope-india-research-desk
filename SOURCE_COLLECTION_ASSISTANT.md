# Real Filing Capture Mode

v25 makes the last mile of source collection safer and easier to learn.

## What It Adds

- `Load sample filing`: fills the paste box with training text for the active company and source type.
- Filing preview: shows detected company, source type, period, and section count before the user commits evidence.
- Readiness impact: shows how the selected source would change the company source status.
- Confidence gate: requires three checks before a source can be added as `REAL`.

## REAL Source Checklist

Before adding verified evidence, the user must confirm:

- Official source URL verified.
- Text copied from the same document.
- Period and date checked.

These checks are deliberately simple. They help prevent accidental promotion of a sample, wrong period, or unrelated source into verified research evidence.

## Sample Text Policy

Sample filings are for training only:

- They are labelled as imported review evidence.
- They are not official filings.
- They should not be exported as production `REAL` evidence.

## Readiness Impact

The preview shows a before/after signal such as:

- `Results: Needed -> REAL ready`
- `Annual report: SYN starter -> IMP review`
- `3/5 REAL now, 4/5 REAL after add`

This lets the operator understand whether the action will actually improve investment-use readiness.

## Product Rule

NiveshScope should make it harder to accidentally overstate trust. A source becomes REAL only when the URL, text, period, and date have all been checked.
