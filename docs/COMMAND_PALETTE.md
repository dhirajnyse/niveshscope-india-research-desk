# Command Palette

The Command Palette is the v50 speed layer for NiveshScope. The product has grown into a full research operating desk, so the user needs one fast way to find rooms, actions, exports, and companies without remembering where every control lives.

## Behavior

- The top-right `Find` button opens the palette.
- `Ctrl+K` on Windows/Linux or `Cmd+K` on macOS opens it from anywhere in the page.
- The search field filters across research rooms, source workflows, reports, trust controls, and company tickers.
- Pressing Enter runs the first visible command.
- Escape or the backdrop closes the palette.

## Command Types

- Section commands jump to major rooms such as Source Studio, Trust Center, Launch Control, IC Memo, and Coverage Map.
- Action commands click existing product controls such as Run analysis, Scan disclosure, Export PDF, Export Markdown, Load next source task, Run source review gate, and Export source pack.
- Company commands focus a company, load a risk-question prompt, refresh the dossier, and route the operator back to the main desk.

## Design Notes

The palette does not duplicate research logic. It calls the same buttons and routes already used by the app, so the feature stays small and reliable. It also avoids inline handlers and keeps the command list rendered through escaped text, preserving the current static security posture.

## Production Direction

In a production app, the palette should become role-aware. Analysts, reviewers, and admins can see different commands, while audit logs record high-impact actions such as source approval, memo export, and release checklist completion.
