# Development Workflow

## Toolchain

- Node.js `24.11.0+`
- npm `11.6.1+`
- Firefox desktop for local testing

Install dependencies:

```bash
npm install
```

## Local Development

Use two terminals:

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm start
```

What happens:

- `npm run dev` clears generated output, runs Vite, and regenerates the manifest/dev entry files.
- `npm start` launches Firefox through `web-ext` and loads the extension from `./extension`.
- Changes in `src/` rebuild automatically.
- The popup, options page, and background page are served from the Vite dev server during development.

Useful variants:

```bash
npm run start:firefox
npm run start:mb
npm run restart
```

- `start:firefox` uses a custom Firefox binary path if you maintain one locally.
- `start:mb` is for Mullvad Browser and is useful only for compatibility checks.
- `restart` is for persistence/restart testing with a dedicated Firefox profile.

## Build

Production build:

```bash
npm run build
```

This pipeline does four things:

1. Clears previous generated artifacts.
2. Runs `vite build` to create `extension/dist/`.
3. Generates `extension/manifest.json` from `src/manifest.ts`.
4. Copies root docs like `README.md` and `LICENSE.md` into `extension/`.

Package a Firefox add-on:

```bash
npm run pack:xpi
```

Optional package outputs also exist:

```bash
npm run pack:zip
npm run pack:crx
```

For this fork, Firefox packaging should be considered the primary release artifact.

## Testing

Linting:

```bash
npm run lint
```

Type checking:

```bash
npm run tsc
```

Unit tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

Recommended pre-merge verification:

```bash
npm run lint && npm run tsc && npm test && npm run build
```

That matches the GitHub Actions CI workflow.

## Manual Firefox Testing

After `npm run build`, you can test the packaged extension manually:

1. Open Firefox.
2. Visit `about:debugging#/runtime/this-firefox`.
3. Choose `Load Temporary Add-on`.
4. Select the built add-on package or the generated manifest flow the repo currently uses.

For day-to-day work, `npm start` is usually faster and easier.

## Development Expectations For This Fork

- Validate normal Firefox behavior first, not only Mullvad Browser behavior.
- Check popup flow, options page behavior, and background-driven features after any meaningful change.
- Be careful around permissions, proxy behavior, storage, and browser action behavior because those are the most Firefox-specific integration points.
- Avoid editing generated files directly inside `extension/`; make changes in `src/` or `scripts/`.
- Keep changes easy to reapply on top of the latest official Mullvad extension updates.
- Treat `main` as the branch that should absorb upstream updates first, then reapply FoxEnhanced patches cleanly.
- Keep FoxEnhanced patch version metadata separate from upstream-owned package/manifest version fields when possible.
- Prefer fork-owned implementations under `src/fox-enhancements/` and only add small upstream hook points when integration is required.
