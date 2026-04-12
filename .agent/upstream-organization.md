# Upstream Organization Notes

## Simple Explanation

The original Mullvad team organized this extension like a small product with three fronts and one packaging layer:

1. `popup` for the quick browser-toolbar interface
2. `options` for the fuller settings experience
3. `background` for extension lifecycle, browser listeners, and proxy coordination
4. `scripts` plus `extension/` for turning source code into a distributable add-on

That separation is one of the cleaner parts of the upstream project and is worth preserving.

## Why They Structured It This Way

- Popup and options are separate UIs with different constraints, so each gets its own entrypoint.
- Shared UI pieces are centralized in `src/components/`.
- Reusable app logic is centralized in `src/composables/`.
- Browser and proxy integration details are kept in `src/helpers/`.
- Packaging logic is kept out of the UI code and handled by scripts.

This keeps the extension understandable even though it spans browser UI, background behavior, storage, permissions, and proxy management.

## What This Means For The Fork

The fork does not need a radically different architecture right away. The better move is to keep the upstream structure and change the priorities inside it:

- evaluate UX through standard Firefox desktop use first
- reduce assumptions that only make sense in Mullvad Browser
- keep background/proxy logic compatible with Firefox APIs
- use popup/options to improve clarity for Firefox users
- keep FoxEnhanced changes maintainable as a patch set on top of the latest upstream Mullvad updates

## Practical Fork Guidance

- Keep upstream-style separation of concerns unless there is a strong reason to simplify it.
- Avoid moving source files into `extension/`; that breaks the current packaging model.
- When behavior differs between Firefox and Mullvad Browser, document the reason in code or docs.
- Favor changes that make local Firefox development and testing easier, since that is the core audience for this fork.
- Prefer modifications that are straightforward to replay or rebase after upstream Mullvad releases.
- Prefer small upstream hook points plus `src/fox-enhancements/` over hiding FoxEnhanced logic inside upstream modules.

## Current Build Philosophy From Upstream

The source tree is not the shipped extension. Instead:

1. Vite builds the UI entrypoints into `extension/dist/`.
2. `src/manifest.ts` generates the runtime manifest.
3. top-level docs are copied into `extension/`.
4. `web-ext` runs or packages the finished extension directory.

That is the mental model contributors should keep while working here.
