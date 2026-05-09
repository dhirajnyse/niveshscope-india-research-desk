# IC Memo Builder

NiveshScope v38 adds an IC Memo Builder for turning the live research desk state into a committee-style packet. It sits after Research Sprint Planner and before Launch Control because it is the bridge between analysis and reviewable output.

The static version is still browser-only, but it proves the workflow shape for a future investment committee room: one place to assemble the answer, evidence, source gaps, review trail, decision trail, valuation assumptions, and execution handoff.

v39 extends the memo with Claim Trace Inspector output. The memo score now considers whether material answer claims have enough citation support, and the Markdown/JSON exports include a claim-trace section for review. v40 then folds memo readiness into Answer Quality Lab so committee packets are checked alongside citation quality and export posture.

## Inputs

The IC Memo Builder reads:

- The current Brief Workbench packet and its cited answer.
- Investment Readiness Gate status, score, blockers, and next source gap.
- Current evidence stack, source types, and SYN citation warnings.
- Latest Memo Review Room decision for the selected ticker.
- Latest Decision Journal entry for the selected ticker.
- Current INR valuation-lens assumptions.
- Research Sprint Planner items and open Desk Task Board pressure.
- Claim Trace Inspector status, trace quality, weak claims, SYN-backed claims, and unsupported critical claims.

No external service is called. The builder assembles state already present in the browser.

## Memo Formats

The format selector changes the decision framing while keeping the same controls:

- `Committee packet`: default packet for a formal investment committee discussion.
- `Pilot pre-read`: lighter version for pilot users and early product review.
- `Source review`: focuses the memo on source gaps and evidence blockers.
- `Watchlist note`: keeps the company in monitoring mode when a full committee ask is premature.

## Controls

The user can:

- Open the top memo blocker.
- Copy the IC memo as Markdown.
- Export the memo as a branded PDF.
- Export a structured JSON packet.

The top blocker routes to the relevant workflow. Missing answers load an IC starter question. Source blockers open Source Pack Studio. Review blockers open Memo Review Room. Decision blockers open Decision Journal. Execution blockers open Research Sprint Planner.

## Scoring

The IC memo score blends:

- Brief Workbench packet score.
- Investment Readiness Gate score.
- Presence of a human memo review.
- Presence of a decision journal entry.
- Citation depth.
- Active sprint handoff quality.
- SYN citation penalties.
- Claim trace quality and unsupported-claim penalties.

The score is a workflow readiness score, not a recommendation. It helps the desk see whether the memo is blocked, draft-ready, or close to committee circulation.

## Exports

The Markdown copy is useful for email, notes, or a manual committee pack. The PDF export uses the same NiveshScope report generator as the research brief so committee packets remain branded and readable. The JSON export is intended as the future backend shape for server-side memo storage, audit logging, and admin dashboards.

## Launch Control

Launch Control includes the IC Memo Builder, Claim Trace Inspector, and Answer Quality Lab in the release score, audit JSON, blocker routing, and post-upload tests. A launch can be blocked if the current IC memo has a high-severity blocker, if the memo score is too weak for a pre-read, if the current answer contains unsupported critical claims, or if answer-level QA fails.

## Production Direction

In production, this should become an authenticated committee workspace with memo owners, version history, approval states, reviewer comments, evidence-locking, PDF archival, and immutable audit logs. The static version is useful because it shows how research output should move from source-backed analysis to a reviewable packet without losing source provenance.
