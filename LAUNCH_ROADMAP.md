# Decision Journal

NiveshScope v31 adds a local research-decision ledger. The Decision Journal is designed to capture the human decision that follows a memo, a readiness gate result, and a source review.

The journal deliberately avoids presenting itself as a buy/sell engine. It records workflow decisions such as needs source work, watchlist candidate, committee candidate, monitor only, or reject thesis.

## What Each Entry Stores

Each saved entry includes:

- Research decision.
- Thesis strength.
- Review horizon.
- Next review date.
- Owner.
- Decision note.
- Trigger or kill criteria.
- Next evidence task.
- Current memo score.
- Investment Readiness Gate status and score.
- Confidence and evidence-quality scores.
- REAL source coverage.
- Current valuation-lens snapshot.
- Citation metadata.

Entries are stored locally in the browser and can be exported as JSON or copied as Markdown.

## Workflow

1. Run a desk question.
2. Review the Investment Readiness Gate.
3. Save a Memo Review Room decision if a human review has been completed.
4. Open the Decision Journal.
5. Record whether the memo needs more source work, should be monitored, should enter the watchlist, should move to committee review, or should be rejected.
6. Add the next evidence task and review trigger.
7. Export or copy the journal when preparing a launch or research file.

## Launch Control Integration

Launch Control now tracks saved decision entries as a separate workflow metric. If no decision exists, it adds a medium-priority blocker because a product launch should show a clear trail from evidence to memo to human decision.

v32 also feeds these entries into Review Radar. The radar uses each decision's next review date and evidence task to surface overdue reviews, upcoming reviews, and unresolved source follow-up work.

## Production Direction

The static version keeps entries in browser storage. A production implementation should store the journal in a backend table with user identity, timestamps, immutable gate snapshots, source-pack references, role-based approvals, and audit-log export.
