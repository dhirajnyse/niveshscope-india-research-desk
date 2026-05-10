# Workspace Recovery Vault

Recovery Vault adds local restore points for the NiveshScope browser workspace. It sits beside Workspace Snapshot and is meant for the moments when the desk is growing quickly: before importing a snapshot, testing a new upload, clearing local data, or handing the workspace to another browser.

The vault stores up to five restore points in local storage. Each restore point contains the same portable workspace snapshot payload used by the export flow: saved briefs, source-pack records, source progress, evidence vault items, memo reviews, decision journal entries, desk tasks, valuation cases, session timeline, and current desk context. The vault deliberately does not include itself inside the snapshot payload, which prevents nested backup files from growing with every checkpoint.

Operators can create a restore point, export the latest restore point as JSON, copy a vault report, restore a selected point, or delete old checkpoints. Restoring a point replaces the allowed NiveshScope local stores and reloads the page so the app state is rebuilt from the recovered data.

This remains a static-browser prototype feature. Production should move recovery into authenticated server-side workspace versions with immutable audit events, account ownership, role-based restore permissions, encrypted object storage, source-file hashing, malware scanning for uploaded evidence, and administrator-visible restore history.
