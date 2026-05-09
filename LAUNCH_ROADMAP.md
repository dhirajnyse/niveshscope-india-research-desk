# Evidence Vault

NiveshScope v43 adds an Evidence Vault below the active answer. The desk already retrieves citations for each question, but those citations were previously tied to the current answer view. The vault gives the operator a small research memory: save the current citation stack, keep the question context attached, and export the saved trail for a reviewer, commit note, or future backend ingestion.

## What It Stores

Each saved evidence item carries the ticker, company, source type, period, section, citation text, source status, confidence metadata, question text, source URL if one is available, and saved timestamp. The vault intentionally keeps the snippet short enough for review handoff while still preserving the evidence trail that produced the answer.

## How To Use It

1. Run a desk question so the answer panel retrieves citations.
2. Open `Evidence vault` from the hero navigation or scroll below the answer panel.
3. Click `Save current citations`.
4. Use `Copy vault` for a Markdown review note or `Export vault` for JSON.
5. Use `Use question` on a saved item to load the original question back into the desk.

## Product Direction

The static version stores the vault in local browser storage. Production should move saved evidence to authenticated server storage, attach immutable source hashes, preserve reviewer identity, and connect the saved trail to source-ingestion jobs, committee memo packs, and audit logs.
