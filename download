# Research Sprint Planner

NiveshScope v37 adds a focused sprint layer above Daily Briefing and Desk Task Board. Daily Briefing finds the next work. Desk Task Board tracks accepted work. Research Sprint Planner turns those signals into a realistic working session.

The static version is local to the browser. It does not sync assignments or calendars yet, but it proves the operating model for a production research workflow.

## Inputs

The sprint planner reads:

- Open Desk Task Board items first, because captured tasks represent accepted analyst work.
- Daily Briefing actions second, to fill unused sprint capacity with high-value uncaptured work.
- Task priority, status, route type, due label, ticker, company, and action type.

Duplicate open tasks are filtered out so a captured task and its original briefing signal do not appear twice in the same sprint.

## Sprint Modes

The planner supports:

- `90-minute focus`: mixed work across open tasks and briefing actions.
- `Source sprint`: source and evidence-collection actions only.
- `Review sprint`: review and decision follow-up actions only.
- `Launch prep`: high-priority source, review, risk, and portfolio actions.
- `Full-day queue`: broader queue using the selected capacity.

Capacity can be set to 3, 5, 8, or 12 actions.

## Workflow

The user can:

- Start the first sprint action.
- Capture one uncaptured sprint item into Desk Task Board.
- Capture all uncaptured sprint items into Desk Task Board.
- Copy the sprint as Markdown.
- Export the sprint as JSON.

Captured tasks keep their original route, so opening them later can still jump to Source Studio, Review Radar, Portfolio Watchtower, Catalyst Calendar, or a desk question.

## Launch Control

Launch Control includes the Research Sprint Planner in its audit pack. The audit records sprint mode, capacity, score, planned count, captured count, source count, review count, high-priority count, and the sprint item list.

The sprint score is an execution score, not an investment score. It rewards captured work and penalizes high-priority pressure so the desk can see whether the next working session is cleanly planned.

## IC Memo Builder

v38 also feeds the active sprint into IC Memo Builder. Committee packets show the current sprint handoff so reviewers can see whether evidence gaps, review actions, or high-priority tasks are still open before the memo is circulated.

## Production Direction

In production, this should become a scheduling service with analyst assignment, calendar integration, reminders, sprint completion history, manager review, and server-side audit logs. The static version is useful because it shows how a research desk should move from source signals to daily execution without losing evidence routing.
