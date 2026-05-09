# Catalyst Calendar

NiveshScope v34 adds a dated research operations calendar. Earlier versions created the source workflow, memo workflow, human review layer, decision journal, review radar, and portfolio watchtower. The Catalyst Calendar converts those signals into dated events so the desk can decide what to work next.

The calendar is not an exchange-announcement feed yet. It is an internal research cadence board. It schedules the work created by the current evidence state: reviews due, source replacements, risk refreshes, and pilot-candidate check-ins.

## Event Sources

The calendar builds events from:

- Review Radar dates and evidence tasks.
- Portfolio Watchtower source gaps.
- High-risk company rows that need refreshed risk memos.
- Pilot-ready or committee-candidate companies that need a check-in.

Each event has a company, date, urgency label, event type, action label, and routing target.

## Filters

The user can filter by:

- All catalysts.
- Reviews.
- Source work.
- Risk refresh.
- Pilot candidates.

The horizon control limits the calendar to the next 7 days, next 30 days, next 90 days, or all open events.

## Routing

`Open next catalyst` routes the oldest and highest-priority event:

- Review events open the matching Review Radar follow-up.
- Source events open Source Studio for the exact company and source type.
- Risk and pilot-candidate events load a desk question for the selected company.

This keeps the calendar operational. It is not just a static list; it moves the user into the next workflow.

## Exports

The calendar can be copied as Markdown or exported as JSON. The JSON includes status, score, event counts, overdue count, source count, review count, risk count, ready count, and the full event list.

Daily Briefing also reads the Catalyst Calendar, so dated events can become the first action in the morning workflow. Launch Control includes the Catalyst Calendar in its audit pack and adds a blocker when events are overdue. A launch-ready research product should show how stale conclusions get refreshed.

## Production Direction

In production, this should become a real scheduling layer with exchange calendar integrations, user assignments, reminder notifications, source freshness checks, and historical completion logs. For now, the static version proves the operating model without a backend.
