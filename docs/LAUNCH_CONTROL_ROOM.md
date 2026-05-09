# Launch Control Room

NiveshScope v28 adds a release cockpit for the static GitHub Pages product. It answers one practical question: what must be true before this version can be called launch-ready?

## Inputs

The Launch Control Room reads the same browser state used by the desk:

- Required source coverage across annual report, concall, results, shareholding, and announcement slots.
- Starter-company readiness for RELIANCE, TCS, and HDFCBANK.
- Current memo packet score from the Brief Workbench.
- Saved human review decisions from the Memo Review Room.
- Saved research decisions from the Decision Journal.
- Review Radar follow-up state, including due reviews, overdue items, and open evidence tasks.
- Portfolio Watchtower score, top company action, source-gap pressure, and high-risk company count.
- Catalyst Calendar score, overdue catalyst count, source events, and review events.
- Daily Briefing score, first action, urgent actions, source-work count, and review count.
- Desk Task Board execution score, open tasks, high-priority tasks, and completed task count.
- Research Sprint Planner score, planned action count, capacity, and first sprint action.
- IC Memo Builder score, committee-packet blockers, PDF/JSON export readiness, and review/decision trail status.
- Claim Trace Inspector score, unsupported claim count, SYN-backed claim count, weakest claim, and blocker status.
- Answer Quality Lab score, blocking dimension count, review dimension count, export posture, and top fix.
- Trust Center score, required trust blockers, source URL trust, storage footprint, and top hardening action.
- Release Doctor runtime marker score, required root-manifest checklist, package name, and GitHub Pages upload-shape guidance.
- Operator Coach next-action state, including the current primary route and desk score.
- Evidence Vault saved-citation count, ticker spread, and REAL/SYN source mix.
- Current evidence mix, including SYN citation warnings.

No external service is called. The launch score is a local readiness view, not a production compliance result.

## Launch Score

The score blends:

- REAL source coverage.
- Starter-company completion.
- Review-log depth.
- Decision-journal depth.
- Review-radar follow-up score.
- Portfolio Watchtower operating score.
- Catalyst Calendar cadence score.
- Daily Briefing focus score.
- Desk Task Board execution score.
- Research Sprint Planner execution score.
- IC Memo Builder committee-packet score.
- Claim Trace Inspector quality score.
- Answer Quality Lab score.
- Trust Center score.
- Release Doctor score.
- Operator Coach score.
- Evidence Vault saved-citation coverage.
- Current memo score.
- Open blocker count.

The status labels are intentionally conservative:

- `Launch blocked`: one or more high-priority blockers are open.
- `Prototype publish ready`: okay to publish as a prototype, but not to market as research-ready.
- `Pilot publish ready`: no high blockers and enough readiness to invite pilot testing.

## Blocker Routing

The `Open next blocker` button routes the user to the right workflow:

- Source blockers open Source Pack Studio for the exact ticker and source type.
- Review blockers scroll to the Memo Review Room.
- Decision blockers scroll to the Decision Journal.
- Radar blockers scroll to Review Radar so overdue decisions or open evidence tasks can be worked first.
- Portfolio blockers scroll to the Portfolio Watchtower so the top company action can be handled.
- Calendar blockers scroll to the Catalyst Calendar so overdue dated work can be handled first.
- Briefing blockers scroll to Daily Briefing so the first urgent action can be started.
- Task-board blockers scroll to Desk Task Board so accepted high-priority work can be moved.
- Sprint blockers scroll to Research Sprint Planner so the next focused work batch can be rebuilt.
- IC memo blockers scroll to IC Memo Builder so the committee packet can be completed.
- Claim-trace blockers scroll to Claim Trace Inspector so the weakest unsupported claim can be opened.
- Answer-quality blockers scroll to Answer Quality Lab so the top QA fix can be opened.
- Release Doctor blockers scroll to the root-manifest guard so the upload shape can be checked before publishing.
- Operator Coach actions sit above Launch Control and choose the highest-value route before the user has to inspect every blocker manually.
- Missing memo blockers load a starter desk question.
- Current-memo blockers open the Brief Workbench.

This keeps the release workflow action-oriented instead of just informational.

## Audit Pack

`Export audit pack` creates JSON containing:

- Release version and generated timestamp.
- Launch score, status, stats, and blockers.
- Company readiness table.
- Current memo packet if one exists.
- Memo review log.
- Decision journal.
- Review Radar summary and item list.
- Portfolio Watchtower summary and company action list.
- Catalyst Calendar summary and event list.
- Daily Briefing summary and action list.
- Desk Task Board summary and task list.
- Research Sprint Planner summary and sprint item list.
- IC Memo Builder summary, sections, blockers, valuation context, review trail, and decision trail.
- Claim Trace Inspector summary, claim list, source status, support score, and citation match metadata.
- Answer Quality Lab score, dimensions, blockers, top fix, claim trace summary, and QA test plan.
- Trust Center score, browser-side security checks, source URL trust state, storage footprint, and hardening action.
- Evidence Vault summary, saved citation items, ticker list, and source-status mix.
- Release Doctor root manifest, runtime checks, package name, upload rule, and smoke tests.
- Post-upload test plan.

The JSON is designed as the future shape for backend release audits and admin dashboards.

## Upload Checklist

`Copy upload checklist` creates a Markdown checklist with:

- Upload steps.
- Current blockers.
- Post-upload tests.
- A Release Doctor root manifest covering the files and folders that must sit at the GitHub repository root.
- A reminder that launch control does not replace human source verification.

Use this after uploading a new ZIP to GitHub Pages so each release has the same smoke-test rhythm.

## Production Direction

The production version should compute launch readiness server-side and store release audits immutably. The static version is useful for workflow design, but production should add authenticated release owners, CI status, dependency scan results, data-ingestion health, source-review approvals, and audit-log retention.
