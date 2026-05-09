# Portfolio Watchtower

NiveshScope v33 adds a portfolio-level operating board. The earlier workflow made it possible to capture sources, generate a memo, review the memo, save a research decision, and track follow-up dates. The Portfolio Watchtower turns those pieces into a daily command screen.

The watchtower is intentionally action-first. It does not ask the user to inspect every panel manually. It scores each company, identifies the most important open action, and routes the user into the right workflow.

## What It Reads

The watchtower combines:

- REAL source coverage across annual report, concall, results, shareholding, and announcement slots.
- Review Radar due dates, overdue reviews, and open evidence tasks.
- Decision Journal entries and thesis status.
- Memo Review Room decisions.
- Company risk index and sector context.

## Company Score

Each company receives a watchtower score. The score rewards REAL source coverage, saved review decisions, saved research decisions, and source completeness. It penalizes overdue reviews, due reviews, open evidence tasks, and elevated company risk.

The score is a workflow readiness indicator, not an investment rating. A high score means the research process is cleaner and easier to audit. It does not mean the stock is attractive.

## Next-Action Routing

Each company card shows one action:

- Open a due or overdue review.
- Replace the next missing, synthetic, or imported source.
- Create a decision by loading a desk question.
- Refresh a high-risk memo.
- Refresh a monitoring memo.

The `Open next action` button works from the top-priority company across the entire watchtower. This is the daily operating loop: open the watchtower, work the top action, then export the board if needed.

## Exports

The watchtower can be copied as Markdown or exported as JSON. The JSON includes score, status, risk, REAL coverage, decision state, review state, and next action for every company. Launch Control also includes the watchtower in its audit pack so release checks can show whether the product has an operating cadence, not just isolated features.

## Production Direction

In production, Portfolio Watchtower should become a server-backed workspace with assigned owners, due-date reminders, ingestion health, source freshness checks, review approvals, and company-level audit history. The static version proves the workflow logic while keeping all data local to the browser.
