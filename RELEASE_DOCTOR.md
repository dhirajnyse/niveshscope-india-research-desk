# Memo Review Room

NiveshScope v27 adds a human review workflow after the Evidence-to-Brief Workbench creates a memo packet. The feature is designed to separate machine-assisted drafting from human judgement.

## Why This Exists

An investment research product needs more than a generated answer. It needs a record of who reviewed it, what decision was made, which evidence was trusted, and which gaps remain open.

The Memo Review Room lets a user save that judgement locally in the browser while the product is still static.

## Review Decisions

The current prototype supports five decisions:

- `Needs source work`: useful answer, but the evidence is not strong enough.
- `Pilot memo ready`: acceptable for product testing and internal review.
- `Committee review ready`: ready for deeper human review.
- `Watchlist only`: interesting but not actionable.
- `Reject thesis`: the answer should not move forward.

Each review also captures conviction, owner, review note, and open risk or next action.

## Stored Review Fields

Each saved review stores:

- Timestamp.
- Ticker and company.
- Memo status and memo score.
- Confidence and evidence quality.
- REAL source coverage count.
- Question and memo headline.
- Human review note.
- Open risk or next action.
- Readiness checks.
- Open source gaps.
- Citation metadata.

The current version stores this in browser local storage. It is useful for prototyping and personal workflow testing, but it is not an enterprise audit log yet.

## Exports

`Export review log` downloads the review log as JSON. This is the best format for future backend import.

`Copy review log` creates a Markdown version for sharing in notes, emails, or a manual investment committee packet.

## Production Direction

The production version should move review logs to the backend with:

- Authenticated reviewer identity.
- Immutable source record IDs.
- Server timestamps.
- Role-based edit/delete permissions.
- Append-only audit events.
- Review status transitions.
- Links back to source files, memo packets, and exported PDFs.

The static v27 feature is the product shape. The launch version should add stronger data integrity and user-level accountability.
