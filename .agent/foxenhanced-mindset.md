# FoxEnhanced Mindset

Treat this as a standing skill for any AI or contributor working on this fork.

## Core Rule

Evade modifications to Mullvad-owned source code whenever a credible FoxEnhanced-owned path exists.

That means the default question is not:

- "where can I edit upstream code to make this work?"

The default question is:

- "how can I make this work from `src/fox-enhancements/` first?"

## Default Behavior

Prefer this order of attack:

1. add or adapt fork-owned code under `src/fox-enhancements/`
2. use an existing FoxEnhanced registry, runtime, wrapper, transform, or additive UI surface
3. inject additive behavior from the fork layer after mount when that is honest and maintainable
4. add the smallest possible generic hook in upstream code only if the feature cannot be done safely from the fork layer

Upstream edits are the exception, not the baseline.

## What “Evade Upstream Edits” Means

When solving a feature or refactor, actively try to avoid changing:

- upstream Vue components in `src/components/`
- upstream entry views in `src/options/`, `src/popup/`, and `src/background/`
- upstream helpers and composables
- upstream manifest/package identity behavior
- upstream enums, tab systems, routing assumptions, or business logic

Instead, prefer:

- fork-owned storage keys
- fork-owned registries and lifecycle managers
- additive DOM/UI insertion from FoxEnhanced-owned bootstrap code
- typed wrappers around upstream actions
- transforms applied at clear extension points
- isolated test helpers and fork-owned test setup files

## Escalation Rule

Only touch Mullvad-owned code when all of the following are true:

- the feature cannot be implemented honestly from `src/fox-enhancements/`
- the change cannot be expressed as additive UI, bootstrap behavior, wrapper logic, or a transform
- the upstream-side edit can be kept very small, generic, and audit-friendly
- the FoxEnhanced behavior still lives primarily in fork-owned files after the change

If you must touch upstream code, the change should read like:

- expose hook
- invoke hook
- pass through transform
- wrap action

It should not read like:

- embed FoxEnhanced feature logic directly in upstream files
- replace an upstream flow with a fork branch
- teach upstream modules about FoxEnhanced-specific product rules

## Design Standard

FoxEnhanced is a patch layer, not a rewrite.

Good FoxEnhanced work should:

- keep upstream diffs small
- keep fork behavior easy to find in one place
- stay understandable during upstream rebases
- preserve auditability for contributors and users

If two approaches both work, prefer the one with:

- fewer upstream edits
- clearer fork ownership
- smaller rebase surface
- more explicit FoxEnhanced boundaries
