# Review Radar

NiveshScope v32 adds a follow-up layer on top of the Decision Journal. The Review Radar is designed for the moment after a research decision has been saved: the thesis is not finished, it now needs a date, an owner, a trigger, and a next evidence task.

The feature reads local Decision Journal entries and converts them into an operations board. It ranks overdue reviews first, then due reviews, open evidence tasks, upcoming reviews, scheduled reviews, and unscheduled decisions.

## What It Shows

The radar summary includes:

- Follow-up score.
- Due review count.
- Overdue review count.
- Upcoming review count.
- Open evidence task count.
- Unscheduled decision count.
- The next review item to work.

Each radar card carries the saved company, decision, gate score, thesis strength, review horizon, owner, review date, and next evidence task. This makes it easier to avoid relying on an old conclusion without checking whether the review trigger has fired.

## Workflow

1. Run a research question.
2. Review the memo, Investment Readiness Gate, and source quality.
3. Save a Decision Journal entry with a review date and evidence task.
4. Open Review Radar.
5. Filter by due reviews, upcoming reviews, or open evidence tasks.
6. Use `Open next review` to route the most urgent item into Source Studio when a source gap exists.
7. Copy the radar as Markdown or export JSON for a research operations file.

## Launch Control Integration

Launch Control now includes Review Radar in the launch score and audit JSON. It adds a medium-priority blocker when reviews are overdue or when several decision evidence tasks remain open. This keeps the product honest: a launch-ready workflow should show not only a generated memo, but also the next human follow-up.

## Production Direction

The static prototype stores the radar inputs in browser storage because it is derived from the Decision Journal. A production system should store decisions and radar events in a backend database with immutable timestamps, reviewer identity, source-pack references, notification rules, and audit exports. Scheduled jobs can then send reminders when reviews become due or when official sources need replacement.
