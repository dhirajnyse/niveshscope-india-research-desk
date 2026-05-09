# Trust Center

NiveshScope v44 adds a Trust Center to make product security visible inside the research desk. The product is still a static browser prototype, but it now has a dedicated panel that checks the loaded app shape, source hygiene, import limits, evidence traceability, and export controls before the user treats a research answer as pilot-ready.

## What It Checks

The Trust Center scores ten visible controls:

- Static Content Security Policy with same-origin scripts, blocked object embeds, and pinned base URI.
- Absence of inline event handler attributes in the loaded DOM.
- Source URL trust, using the configured trusted-domain list for official company, NSE, BSE, SEBI, and research-source links.
- Import limits for per-file size, total upload size, and pasted source text length.
- REAL source coverage across the required annual report, concall, results, shareholding, and announcement source slots.
- Current answer citation safety, including SYN and imported citation counts.
- Evidence Vault traceability, including saved item count and REAL saved evidence.
- Local browser storage footprint.
- PDF, Markdown, and copy export controls.
- Release Doctor shape checks for GitHub Pages upload safety.

## How To Use It

Open `Trust center` from the hero navigation. The panel shows a trust score, six operating metrics, and a checklist. `Open top hardening action` routes to the exact workflow that can improve the weakest control. `Copy trust report` creates a Markdown note, and `Export trust report` creates JSON for release records.

## Security Direction

This static panel is a product-shape guard. Production should add authenticated accounts, role-based permissions, server-side source hashing, malware scanning for uploads, dependency and secret scans in CI, immutable audit logs, reviewer identity, and signed source-transition records.
