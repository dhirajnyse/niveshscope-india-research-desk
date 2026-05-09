# Source Collection Assistant

v24 makes the real-source replacement workflow beginner-friendly. The goal is to remove confusion between opening a source website, filling the source URL field, pasting source text, and adding evidence to the live corpus.

## Button Meanings

- `Open source site`: opens NSE, BSE, Company IR, Screener, or a scoped web search in a new browser tab.
- `Fill URL`: copies that source page URL into the Source URL field inside NiveshScope.
- `Detect and fill builder`: reads pasted source text and fills the structured source sections.
- `Add to live corpus`: adds the reviewed source record into the current browser corpus.

## Beginner Flow

1. Click a missing or SYN source task, such as `RELIANCE Results`.
2. In Source Studio, look at the active replacement task.
3. Click `Open source site`.
4. On the official site, search the company and open the latest matching document.
5. Return to NiveshScope and click `Fill URL`.
6. Paste useful source text into the large paste box.
7. Click `Detect and fill builder`.
8. Review the filled source sections.
9. Add as `REAL - verified source` only if the URL and text match the official document.
10. Click `Add to live corpus`.

## Progress Memory

The assistant tracks progress in the browser:

- `Queued`: task has been opened but not collected.
- `Collected`: source site opened or URL filled.
- `Pasted`: pasted source text has been detected into builder sections.
- `Verified`: source has been added as REAL evidence.

This progress memory is a local browser aid. Production systems must store source status, reviewer identity, document hash, and timestamps on the backend.

## Product Rule

Do not hide uncertainty. If a source is not REAL, NiveshScope should continue to label the answer as prototype evidence.
