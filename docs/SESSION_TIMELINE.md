# Session Timeline

The Session Timeline is the browser-local activity trail for NiveshScope research sessions. It helps an operator answer a simple question before resuming, handing off, or exporting work: what actually happened in this session?

## What It Records

v54 records the major actions that change the state of a research session:

- Research analysis runs, including successful answers, no-document blocks, and low-recall results.
- Source records added from Source Pack Studio into the live browser corpus.
- Current brief copy, Markdown export, and PDF export actions.
- Saved brief actions.
- Research Handoff copy, export, and next-action routing.
- Manual checkpoints added by the operator when a meaningful review, source decision, or pause point is reached.

Each event stores a time, type, title, detail, ticker, release label, data version, and compact desk metrics such as current source coverage, saved brief count, and active source-task count.

## User Workflow

Open `Timeline` from the hero navigation, top bar, Quick Navigator, or Command Palette. The panel shows event totals, source activity, report activity, and checkpoint count. The newest events appear first.

Use `Add checkpoint` after a useful manual review, for example after checking an NSE filing or deciding that a source is not good enough. Use `Copy timeline` to place a Markdown trail on the clipboard, or `Export timeline` to download JSON for handoff and release records. Use `Clear timeline` when starting a fresh browser-local session.

## Prototype Scope

The v54 implementation is intentionally client-side and stored in browser local storage. It is useful for workflow visibility and prototype testing, but it is not yet a production audit log. Clearing browser data removes it, and local events are not identity-bound.

## Production Direction

In production, the same product shape should become a server-backed audit stream with authenticated users, immutable event IDs, backend timestamps, source document fingerprints, file hashes, source URL fingerprints, reviewer identity, role-based export permissions, and tamper-evident storage. The client timeline should remain a friendly working view, while the backend audit trail becomes the system of record.
