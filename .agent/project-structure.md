# Project Structure

## High-Level Layout

```text
.
|-- src/
|   |-- background/
|   |-- components/
|   |-- composables/
|   |-- fox-enhancements/
|   |-- helpers/
|   |-- options/
|   |-- popup/
|   |-- styles/
|   `-- manifest.ts
|-- scripts/
|-- extension/
|-- .github/workflows/
|-- package.json
|-- vite.config.mts
|-- vitest.config.mts
`-- tsconfig.json
```

## Directory Roles

### `src/background/`

Background page entrypoint. This is where the extension attaches browser event listeners and initializes proxy-related lifecycle behavior.

Current role:

- start extension listeners
- initialize proxy listeners
- support dev-time hot reload wiring

### `src/popup/`

Toolbar popup app. This is the most user-visible, quick-action surface. It focuses on connection state, privacy recommendations, and fast actions.

### `src/options/`

Full-page settings UI. This is where more detailed configuration and explanations belong when they do not fit well in the popup.

### `src/components/`

Shared Vue UI building blocks. The Mullvad team kept many UI pieces here so popup/options pages can reuse presentation logic instead of duplicating it.

Examples:

- location selection UI
- proxy lists
- recommendation visuals
- shared labels/buttons/headers

### `src/composables/`

Reusable stateful logic. This is where the project puts logic that sits between Vue UI and browser/helper code.

Typical responsibilities:

- connection state loading
- recommendations state
- proxy permissions and history
- tab or storage-backed state
- warning derivation

When a component starts holding too much logic, this is usually the first place to extract it to.

### `src/fox-enhancements/`

Fork-owned extension-point layer. This is the preferred home for FoxEnhanced bootstrap hooks,
transforms, wrappers, and additive modules.

Current role:

- define typed FoxEnhanced hook registries
- keep bootstrap entrypoints out of feature code
- provide a clear place for future fork-specific patches to register themselves

This directory should contain most FoxEnhanced-specific code over time, while upstream modules
remain responsible only for exposing or invoking named extension points.

### `src/helpers/`

Lower-level utility and browser integration layer. This includes direct browser API interactions and focused utility modules that do not need Vue lifecycle semantics.

Examples:

- browser action helpers
- permissions helpers
- proxy badge and listener logic
- SOCKS proxy transformation and selection utilities
- tab helpers

### `src/styles/`

Shared styling entrypoint and theme overrides used by popup/options apps.

### `src/manifest.ts`

Source of truth for the generated extension manifest. Do not hand-edit `extension/manifest.json`.

### `scripts/`

Build-prep scripts used to turn source code into a runnable/packageable Firefox extension.

Current scripts:

- `prepare.ts`: generates dev stubs and writes the manifest
- `manifest.ts`: writes `extension/manifest.json`
- `copyFilesToExtensionFolder.ts`: copies root docs into `extension/`
- `utils.ts`: shared script helpers

### `extension/`

Generated extension package directory consumed by `web-ext`.

Important rule:

- build output belongs here
- packaging input belongs here
- source editing should usually not happen here

## File Ownership Heuristics

Use these quick rules when deciding where a change should live:

- New UI block reused in multiple places: `src/components/`
- View-only wiring for popup: `src/popup/`
- View-only wiring for settings/options: `src/options/`
- Browser event lifecycle or extension startup logic: `src/background/` or `src/helpers/`
- Fork-owned additive hooks, transforms, wrappers, and registration: `src/fox-enhancements/`
- Reusable stateful logic with Vue reactivity: `src/composables/`
- Pure utility or browser API wrapper: `src/helpers/`
- Manifest/permissions/package shape: `src/manifest.ts` or `scripts/`

## Testing Layout

Tests live close to the code they validate, mostly as `*.test.ts` files inside `src/`.

That organization makes it easier to evolve composables/helpers alongside their coverage and is consistent with the current Mullvad layout.
