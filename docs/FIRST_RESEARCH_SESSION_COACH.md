# First Research Session Coach

NiveshScope v52 adds a compact first-session coach inside the research desk. The feature is designed for the moment when the product has many strong rooms but a new operator needs a simple path: ask one question, inspect the answer, replace the first source with REAL evidence, then save or export the first useful brief.

## What It Tracks

The coach reads the current browser state and turns it into a six-step session checklist:

- Load the first question.
- Run a cited answer.
- Check answer readiness.
- Replace one source with REAL evidence.
- Save or export the first brief.
- Learn the map through the guided tour.

The score is not an investment-readiness score. It is an operating-progress score for the first research session, so the operator knows what to do next without reading the whole page.

## Actions

The panel chooses a primary next action from the current state. It can load a sample ticker question, run the first answer, open the readiness gate, route to the next source task, save the current brief, open the guided tour, export a PDF, or open the command palette.

The top bar also has a `Coach` button, and the hero has a `First session` link. Both route to the same cockpit so the operator has a reliable home base.

## Product Role

The Session Coach sits above Operator Coach. Operator Coach is for broad desk operations after the product is active. Session Coach is deliberately narrower: it helps someone complete the first full loop and build confidence in the workflow.

## Production Direction

A production version should store first-session milestones per user and workspace, not only in browser state. It should also record the exact source task, answer, readiness gate score, export event, and reviewer action that completed each step. That audit trail can power onboarding analytics and help the product team see where operators get stuck.
