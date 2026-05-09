# Daily Briefing

NiveshScope v35 adds a morning command layer for the research desk. Earlier workflow panels showed source gaps, saved decisions, portfolio actions, and catalyst dates separately. Daily Briefing combines those signals into one ranked list so the analyst can start with the highest-value action.

The feature is still local and browser-only. It does not call an external market-data feed or recommendation service. It reads the current evidence state, local saved reviews, local decision journal, and generated workflow signals.

## Inputs

Daily Briefing builds its action list from:

- Catalyst Calendar events, including overdue reviews, source tasks, risk refreshes, and pilot-candidate check-ins.
- Portfolio Watchtower company actions, including source gaps, missing decisions, review follow-ups, and high-risk names.
- Review Radar overdue or due decisions, including saved evidence tasks.

Actions are deduplicated by type, ticker, and title so the analyst sees one clear next step instead of the same problem repeated across panels.

## Modes

The briefing mode changes what the user sees:

- `Morning desk`: the full prioritized briefing across source work, reviews, portfolio actions, and catalysts.
- `Source sprint`: only source-replacement and evidence-collection work.
- `Review sprint`: only overdue or due review work.
- `Launch prep`: actions most likely to affect launch readiness.

Each mode keeps the same routing model. The top action can still open Source Studio, Review Radar, Portfolio Watchtower, or Catalyst Calendar depending on the action type.

## Scoring

The focus score is a simple operating score:

- It starts from 100.
- Urgent actions reduce the score.
- Source-work pressure reduces the score modestly.
- Portfolio Watchtower strength improves the score modestly.

This is not an investment score. It is a desk-operations score that answers: how noisy is the research queue right now?

## Routing

`Start first action` routes the highest-ranked briefing item:

- Calendar actions call the Catalyst Calendar routing logic.
- Portfolio actions call the Portfolio Watchtower routing logic.
- Review actions call the Review Radar routing logic.

Each card also has its own action button, so the user can skip the first item and open a specific action directly. v36 adds `Add to tasks`, which captures the same action into Desk Task Board for status tracking before or after opening the source workflow.

## Exports

Daily Briefing can be copied as Markdown or exported as JSON. The JSON includes product version, generated timestamp, mode, focus score, headline, urgent/source/review counts, launch label, and the full action list.

Launch Control includes the Daily Briefing in its audit pack. It also adds a medium blocker when the briefing has multiple urgent actions, because a launch-ready desk should not hide stale reviews, source gaps, or overdue catalysts.

## Production Direction

In production, Daily Briefing should become a user-specific morning workflow with assignments, completed-action history, saved daily snapshots, notification preferences, and server-side audit logs. It should also include source freshness from live NSE/BSE/company feeds once the ingestion layer exists.
