# Workspace Snapshot

Workspace Snapshot gives NiveshScope a portable browser-local backup. The static prototype now has many useful local artifacts: saved briefs, source-pack records, source collection progress, evidence vault items, memo reviews, decision journal entries, desk tasks, valuation cases, product tour state, and the session timeline. v55 packages those local stores into one JSON file that can be downloaded, archived, or restored in another browser session.

## What It Exports

The snapshot includes only NiveshScope local-storage keys that the app owns. It does not scrape unrelated browser storage, cookies, credentials, or third-party data. The JSON contains release metadata, data version, generated timestamp, active desk context, counts, the allowed storage map, and a lightweight checksum so the operator can compare two snapshot manifests.

The active desk context records the selected ticker, current question text, answer depth, selected-ticker guard state, citation count, and current answer confidence. Persistent research work is stored through the local stores themselves.

## How To Use It

Open `Snapshot` from the hero, top bar, Quick Navigator, or Command Palette. Review the local store cards to see what will be preserved. Use `Export snapshot` before uploading a new release, moving to another machine, clearing browser data, or handing work to a teammate. Use `Copy manifest` when you only need a human-readable inventory.

To restore, use `Import snapshot`, choose a previously exported NiveshScope snapshot JSON, and let the desk reload. The import only accepts known NiveshScope storage keys and rejects files that exceed the configured browser import limit.

## Prototype Limits

This is a browser-local convenience layer. It is not a production backup system and it does not provide encryption, account identity, role-based restore permissions, or immutable audit storage. Anyone with the exported JSON can inspect the local research artifacts inside it.

## Production Direction

In production, the same workflow should become account-aware workspace versioning. Snapshots should be signed server-side, encrypted at rest, access-controlled, linked to user and organization identity, scanned for malware when files are attached, and tied into the audit log. The UI should remain simple: export, import, compare, and restore, while the backend handles custody and compliance.
