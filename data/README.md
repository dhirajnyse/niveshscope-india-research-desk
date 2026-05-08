# NiveshScope Data Pack

NiveshScope v5 loads its starter research universe from this folder.

## Files

- `companies.json`: Company fundamentals, model assumptions, thesis text, and risk-factor templates.
- `documents.json`: Source documents and section text used by the in-browser retrieval engine.
- `questions.json`: Question templates shown in the left rail.
- `watchlists.json`: Watchlist definitions and public ticker aliases.
- `source-pack-template.json`: Copyable schema for adding real annual reports, concalls, results notes, shareholding extracts, and NSE/BSE announcement text.

## Source Labels

Each document should include a `sourceStatus`:

- `synthetic`: Demo/starter text used only for product prototyping.
- `imported`: User-pasted or user-uploaded source text.
- `real`: Real source text that has been reviewed and can be tied to an original filing, transcript, or announcement.

NiveshScope displays these labels in the library, dossier, and evidence cards so research output does not blur demo evidence with real source material.

## Builder Workflow

In v6, the browser app includes `Source Pack Studio`. Use it to create source records, test them immediately in the live corpus, and export a JSON file. After review, copy those exported records into `documents.json`.
