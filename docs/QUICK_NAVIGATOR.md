# Quick Navigator

The Quick Navigator is the v49 navigation layer for NiveshScope. The product now contains many operating rooms: Source Studio, Review Gate, Trust Center, Launch Control, IC Memo Builder, Decision Journal, Portfolio Watchtower, and several source-collection views. The navigator gives the operator one small floating control that can jump to any major section without scrolling through the full page.

## Behavior

- The `Nav` button sits above the back-to-top button in the bottom-right corner.
- Opening the button reveals a compact drawer with grouped workflow links.
- The search field filters by group, section title, or short section purpose.
- Clicking a link closes the drawer and jumps to the matching page anchor.
- Pressing Escape or clicking outside the panel closes the drawer.

## Accessibility

The control uses a real button with `aria-expanded` and `aria-controls`. The panel keeps a visible close button, focuses the search field when opened, and avoids inline event handlers so it remains compatible with the static content security policy.

## Product Role

This feature does not add research logic. It removes operating friction. As the research desk grows, users need fast movement between source collection, answer quality, launch readiness, and memo export without memorising the page order. The navigator keeps those rooms discoverable while preserving the existing launch hero and deep-work panels.
