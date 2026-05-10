# Pilot Feedback Room

The Pilot Feedback Room turns a founder-led NiveshScope demo into structured product signal. After each pilot conversation, the operator can save the strongest buying signal, the biggest objection, the target company, the user profile, and the next follow-up task.

## What It Produces

- A signal score based on saved feedback, hot pilot intent, and unresolved objections.
- A feedback ledger stored in the browser with pilot name, profile, company, outcome, signal, objection, next step, and date.
- An objection radar that groups comments into source proof, security, pricing, coverage, workflow, and conversion signals.
- A next-action router that opens Source Studio, Trust Center, Coverage Map, Pricing, Answer Quality, or Pilot Demo Room depending on the strongest blocker.
- A copyable Markdown report and exportable JSON feedback pack for handoff, CRM notes, or founder review.

## Operator Workflow

1. Open Pilot Demo Room and run the five-minute walkthrough.
2. Open Pilot Feedback Room from the top Feedback button, hero link, quick navigator, or command palette.
3. Save the account name, profile, focus company, outcome, strongest signal, objection, and follow-up task.
4. Review the objection radar to see whether source proof, security, pricing, coverage, workflow, or conversion is the top signal.
5. Click `Open next follow-up` to jump to the room that can resolve the most important blocker.
6. Copy or export the feedback report after the demo so the next build is driven by pilot evidence.

## Why It Exists

Once the product is demoable, the next risk is losing learning. Informal reactions disappear quickly unless they are captured while fresh. This room makes pilot feedback operational: every conversation creates a next source task, security answer, pricing clarification, coverage request, workflow fix, or conversion follow-up.

## Production Direction

The static version stores feedback in local browser storage. A production version should connect entries to authenticated accounts, CRM contacts, meeting timestamps, source commitments, follow-up owners, outcome stages, pilot cohort analytics, and immutable audit records. It should also support scheduled follow-ups and aggregate objections across users so product planning is based on repeated demand rather than memory.
