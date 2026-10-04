# ProjectRow

A product-showcase card: screenshot in a browser frame, number, name, problem, result, tags, status and actions.

- Provide `index` ("01"), `name`, `problem` (one sentence on the business problem, no tech words), `outcome` (a number or sentence — shown in a "Result" strip), `tags`, `status` (`live`|`demo`), `liveUrl`, `githubUrl`, `image`/`phoneImage`.
- `featured`: full width, 7/5 split, larger name, optional overlapping phone. Use it for exactly one project. Other rows sit two-up.
- No `githubUrl` → a lock + "Private client code" note replaces the GitHub button (override with `privateNote`). Never a dead link.
- No `image` → the BrowserFrame placeholder with the project name.
- `status: 'demo'` changes the button to "View demo".
