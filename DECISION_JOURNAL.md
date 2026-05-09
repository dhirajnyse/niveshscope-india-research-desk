# Evidence-to-Brief Workbench

NiveshScope v26 adds a memo workbench between answer generation and research export. The goal is to make every report reviewable before it is treated as a useful investment memo.

## What The Workbench Does

The workbench reads the current desk answer, its answer metadata, and the active evidence stack. It then creates a memo readiness view with:

- Current focus ticker and research intent.
- Memo score and status label.
- Evidence quality, confidence, and source coverage context.
- A checklist of what is ready and what still needs work.
- The citations used in the answer.
- Open source gaps for the company.

The workbench does not call external services and does not create new research conclusions. It only packages and audits the current in-browser answer.

## Readiness Checks

The memo score is based on six checks:

- A question and generated answer exist.
- At least three cited passages were retrieved.
- At least two source types are represented.
- Evidence quality is at least 75 percent and has no off-ticker mismatch.
- REAL citations are present and no SYN citation remains in the current answer.
- All required company source types are REAL.

The status labels are intentionally conservative:

- `Committee review ready`: strong score and no SYN citations.
- `Pilot memo ready`: useful for product testing but still needs review.
- `Evidence work needed`: answer exists, but source depth or quality is not yet strong enough.

## Packet Exports

`Copy memo packet` creates a Markdown packet with:

- Question.
- Current brief.
- Readiness checks.
- Evidence used.
- Open source gaps.
- A research-software disclosure.

`Export packet JSON` creates a structured object with the same information. In the future backend version, this shape can become the starting point for stored research packets, audit logs, or reviewer workflows.

## Source Gap Handoff

`Open next source gap` uses the same required-source model as the Starter Pack and Coverage Command Center. If the active company still lacks a REAL annual report, concall, results note, shareholding pattern, or exchange announcement, the button opens Source Pack Studio for that exact replacement task.

This keeps the user loop simple:

1. Ask a question.
2. Review the answer.
3. See why it is or is not memo-ready.
4. Replace the next weak source.
5. Run the answer again.

## Launch Notes

The workbench remains a client-side prototype. Production should store memo packets server-side with user identity, source record IDs, source URLs, timestamps, reviewer status, and immutable audit history.
