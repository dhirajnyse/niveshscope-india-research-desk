# Investment Readiness Gate

NiveshScope v30 adds an answer-level gate that sits between the research question and the generated memo. The goal is to make the product honest about the difference between a useful demo answer, an analyst-review draft, and a memo that may be ready for investment committee review.

The gate is intentionally conservative. It does not decide whether a stock is investable. It decides whether the current memo has enough source quality, citation depth, and review discipline to be treated as more than a prototype output.

## What The Gate Checks

The gate reviews the active answer and scores:

- Active research answer: a desk question has been run.
- Evidence depth: at least three cited passages are available.
- Source spread: more than one source type supports the answer.
- Evidence quality: the evidence guard score is at least 80.
- Confidence discipline: model confidence is at least 75.
- No off-ticker drift: single-company answers have no mismatched citations.
- REAL citation mix: at least one REAL citation and no SYN demo citations.
- Company source coverage: all required source types are REAL for the company.
- Human memo review: a pilot-ready or committee-ready review decision has been saved.

Required blockers prevent the gate from calling a memo committee-ready. Review items lower the score and keep the memo in pilot-review posture.

## Export Posture

PDF and Markdown exports include gate metadata:

- Gate status.
- Gate score.
- Export posture.
- First blocker when one exists.

This keeps exported reports from looking more mature than their evidence stack. A memo can still be exported while blocked, but the exported file carries the warning.

## Workflow

1. Run a desk question.
2. Read the Investment Readiness Gate above the answer.
3. If blocked, use `Open next evidence gap` to route work into Source Pack Studio.
4. Replace SYN or missing records with REAL verified source records.
5. Save a Review Room decision when a human has reviewed the memo.
6. Export PDF or Markdown only with the gate status visible.

## Production Direction

The static browser version uses local state and client-side checks. A production SaaS version should persist gate audits in the backend, attach them to exported reports, and require role-based human approval before committee-ready status can be published to shared workspaces.
