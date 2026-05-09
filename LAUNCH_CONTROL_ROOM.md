# Desk Task Board

NiveshScope v36 turns Daily Briefing actions into a persistent research execution board. Daily Briefing answers what should be worked first. Desk Task Board records that work, tracks its status, and keeps the route back to the underlying workflow.

The static version stores tasks in local browser storage. It does not sync between devices and does not create server-side assignments yet. This is intentional for the GitHub Pages prototype.

## Task Capture

Tasks can be captured from:

- The first action in the current Daily Briefing mode.
- Any individual action card inside Daily Briefing.

When a task is captured, the board stores the ticker, company, title, detail, route type, source route id, due label, priority, owner, created timestamp, and current status. Duplicate open tasks from the same briefing signal are blocked so the board stays clean.

## Status Workflow

Each task moves through:

- `Queued`: captured but not started.
- `In progress`: opened or advanced by the analyst.
- `Done`: completed locally and available in the task history until cleared.

The board can filter open tasks, all tasks, high-priority tasks, source tasks, review tasks, and done tasks.

## Routing

Each task keeps its original route:

- Calendar tasks open the Catalyst Calendar action.
- Portfolio tasks open the Portfolio Watchtower action.
- Review tasks open the Review Radar item.
- Fallback tasks load a desk question for the ticker.

Opening a queued task automatically moves it to `In progress`, which gives the user a simple execution trail.

## Exports

The board can be copied as Markdown or exported as JSON. The JSON contains product version, generated timestamp, execution score, open count, high-priority count, in-progress count, done count, next task, and the full task list.

Research Sprint Planner reads open Desk Task Board items first, then fills any unused capacity from Daily Briefing. Launch Control includes the Desk Task Board in its audit pack and adds a medium blocker when high-priority tasks pile up. This makes launch readiness sensitive to work that has already been accepted by the analyst.

## Production Direction

In production, this should become a multi-user workflow service with authenticated owners, task comments, due dates, reminders, completion evidence, immutable audit history, and team-level queues. The static version proves the operating model before adding a backend.
