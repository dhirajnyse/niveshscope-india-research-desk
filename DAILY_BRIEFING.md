# Answer Quality Lab

NiveshScope v40 adds an Answer Quality Lab for reviewing whether the current answer is good enough to copy, export, discuss, or route into an investment committee packet. It sits after Claim Trace Inspector and before Launch Control because the answer itself is the product surface users will judge first.

## Inputs

The lab reads browser-local state already created by the desk:

- Current answer and Brief Workbench packet.
- Citation count, source types, evidence quality, off-ticker guard status, and source mix.
- Investment Readiness Gate score and blockers.
- Claim Trace Inspector score, weak claims, unsupported critical claims, and SYN-backed claims.
- IC Memo Builder score and packet status.
- Latest Memo Review Room decision and Decision Journal entry for the focused ticker.

No external service is called. The lab is deterministic and does not replace human source verification.

## Quality Views

The selector changes which quality dimensions are emphasized:

- `Release readiness`: full QA view across evidence, claims, review trail, and exports.
- `Citation quality`: citation depth, source quality, REAL/SYN mix, claim support, and ticker discipline.
- `Committee memo`: checks whether the current answer can support an IC memo.
- `Export hygiene`: focuses on PDF, Markdown, JSON, claim trace, and readiness-gate posture.

Each view keeps the same scoring language so the user can quickly see whether the answer is blocked, needs review, or passes the visible checks.

## Dimensions

The lab scores:

- Active answer.
- Citation depth.
- Evidence quality.
- REAL source mix.
- Claim support.
- Ticker discipline.
- Readiness gate.
- Review trail.
- Committee packet.
- Export hygiene.

Required dimensions below target become blockers. Non-required weak dimensions become review items. The top fix is chosen from the weakest required item first, then the weakest review item.

## Controls

The user can:

- Open the top fix.
- Open any individual quality dimension.
- Copy a Markdown QA report.
- Export a structured JSON QA report.

Routing is practical. Missing answers load a starter question. Source issues open Source Pack Studio. Claim issues open Claim Trace Inspector. Readiness issues open Investment Readiness Gate. Review and decision gaps open their respective rooms.

## Launch Control

Launch Control now includes Answer Quality Lab in its score, stats, audit JSON, blocker routing, and post-upload test plan. A launch can be blocked if the current answer has required QA failures, even when the app UI itself is functioning. This prevents the team from shipping a polished interface around a weak answer.

## Production Direction

In production, this should become an answer-evaluation service with saved QA runs, reviewer overrides, model-version metadata, source-span alignment, regression test sets, customer-visible report status, and immutable export audit logs. The static version proves the workflow and data shape before that backend is built.
