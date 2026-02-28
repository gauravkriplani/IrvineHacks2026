# AOM Wrapper Generator

This project provides a CLI and a simple HTTP server to generate AOM wrapper artifacts from a ZIP of a project's `src/` directory.

Quick start (install deps):

```bash
cd IrvineHacks2026
npm install
```

Run server:

```bash
npm run start-aom-server
```

POST a form with `file` field to `/api/generate-aom` and you'll receive `aom-wrappers.zip` as response.

Or use the CLI:

```bash
node tools/cli-generate-aom.js path/to/source.zip path/to/output-aom.zip
```

Notes:

- The generator uses static AST parsing to find JSX interactive elements and generate per-file AOM wrappers and a `manifest.json`.
- Keep uploads small; large repositories may take time.
