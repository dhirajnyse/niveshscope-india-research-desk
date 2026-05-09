# Operator Coach

NiveshScope v42 adds an Operator Coach directly above the Investment Readiness Gate. The goal is to make the growing research desk easier to operate: instead of asking the user to remember which panel should be used next, the Coach reads the current desk state and recommends one next move. In v43, the Coach also watches the Evidence Vault so saved citations become part of the operating picture. In v44, it also reads the Trust Center score so security hardening can become the next action when the desk needs it. In v45, source-work routing can hand the operator into Guided Source Collector before deeper source tools. In v46, pasted source work can then move through the Source Citation Extractor for section-ready evidence. In v47, source work also gains a Source Review Gate before it is trusted as live-corpus evidence.

## Inputs

The Coach uses existing local product signals:

- Current Brief Workbench packet status and packet score.
- Investment Readiness Gate score, required blockers, and next evidence gap.
- Answer Quality Lab score, top fix, and blocking or review dimensions.
- Selected-company real-source completeness.
- Evidence Vault saved-citation count and source-status mix.
- Trust Center score and top hardening action.
- Latest Memo Review Room decision for the focused ticker.
- Latest Decision Journal entry for the focused ticker.
- Launch Control next blocker and overall release state.
- Release Doctor runtime/root-manifest score.

No external service is called. The Coach is a browser-side routing layer over the same local state already used by the desk.

## Recommendation Logic

The Coach prioritizes work in a practical order:

1. If no answer is loaded, run a starter risk question for the selected ticker.
2. If the gate has a required evidence blocker and a source gap, open that exact Source Studio task.
3. If Answer Quality has a top fix below pass level, open the QA fix workflow.
4. If the answer has not been reviewed by a human, open Memo Review Room.
5. If a review exists but no decision is logged, open Decision Journal.
6. If Release Doctor sees a release marker or root-manifest issue, open Release Doctor.
7. If Launch Control has another blocker, route through Launch Control.
8. If no obvious blocker remains, export the launch audit pack.

This keeps the desk action-oriented while still leaving deeper scoring and evidence review in the specialized panels.

## Actions

`Do next action` performs the primary route:

- Starter question: loads and runs a selected-ticker risk question.
- Source gap: opens Source Pack Studio for the exact ticker and source type.
- Answer quality: opens the highest-priority QA fix.
- Review: scrolls to Memo Review Room.
- Decision: scrolls to Decision Journal.
- Release: scrolls to Release Doctor.
- Launch: delegates to Launch Control blocker routing.
- Audit: downloads the launch audit JSON.

The Coach also shows a short queue so the user can see the next few likely tasks without reading every panel.

## Copy And Export

`Copy plan` produces a Markdown operating note with focus ticker, stage, score, metrics, and queue. `Export plan` produces JSON with the same structure. These outputs are designed for handoff to a research assistant, review note, or future backend task scheduler.

## Production Direction

The production version should turn the Coach into a role-aware assistant that respects permissions, assigned owners, source-review status, Source Review Gate outcomes, saved-evidence provenance, trust posture, citation extraction status, and calendar due dates. It should persist action outcomes server-side, record who accepted or completed a recommendation, and connect to workflow systems such as GitHub, Linear, or an internal task queue. The static v42-v47 Coach proves the routing shape before those backend commitments are made.
