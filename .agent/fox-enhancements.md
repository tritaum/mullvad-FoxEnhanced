# FoxEnhancement Architecture

## Purpose

FoxEnhanced should aim to keep most fork-specific behavior in `src/fox-enhancements/` instead of
spreading it throughout upstream modules.

When that behavior includes UI, treat `.agent/uncodixfy.md` as the default design guidance for
fork-owned surfaces.

The goal is auditability:

- upstream behavior stays easy to compare against Mullvad
- fork-owned behavior is easier to review in isolation
- future upstream merges have fewer mixed-purpose conflicts

## Why Zero-Touch Patching Is Not Realistic

In this repository, strict zero-touch patching is not a realistic default:

- Vue SFC templates are compiled, so there is no clean or trustworthy way to patch arbitrary UI internals at runtime
- Vite + ESM imports are static by design, which makes broad module monkey-patching both brittle and harder to attest
- hidden code injection would make the fork look more sketchy, not less

The safer model is a pragmatic one:

- keep upstream code visually close to upstream
- add a small number of explicit extension points
- move the actual FoxEnhanced behavior behind those extension points
- keep manifest/package identity upstream-owned when the change is not honestly hookable

## Best Hook Boundaries In This Repo

The strongest boundaries available today are:

- popup `main.ts` for app bootstrap hooks before mount
- options `main.ts` for app bootstrap hooks before mount
- `background/main.ts` for additive startup hooks after the baseline listeners are initialized
- selected composables for derived-data transforms and action wrappers
- selected top-level UI containers for additive UI surfaces

These boundaries are preferable because they are easy to audit and usually require only tiny core
changes.

## Decision Rules

When adding FoxEnhanced behavior:

1. Put the implementation in `src/fox-enhancements/` first.
2. Reuse an existing hook or wrapper if one exists.
3. If no hook exists, add the smallest core touch point needed to expose one.
4. Keep the core-side change generic and named.
5. Avoid mixing feature logic into upstream modules unless there is no safer alternative.

## Recommended Hook Styles

Preferred order:

1. additive hooks
2. typed derived-data transforms
3. before/after action wrappers
4. full replacement only when unavoidable

Examples of good patterns:

- registering a popup bootstrap hook that provides a FoxEnhanced service
- applying a transform to a derived list before rendering
- wrapping a proxy-setting action with a small before/after policy layer
- inserting an extra panel from a top-level container hook
- rendering additive About-tab labels from a FoxEnhanced registry while leaving the base component upstream-like

## Not Recommended

- Vite alias tricks that silently replace upstream modules
- monkey-patching arbitrary module imports
- patching compiled component internals
- large fork-only branches embedded directly in upstream business logic
- build-time magic that hides where FoxEnhanced behavior is coming from
- pretending manifest icons, package metadata, or Gecko identity are runtime-hookable when they are not

## Auditability Rule

Core changes should read like:

- `invoke FoxEnhanced hook`
- `register FoxEnhanced hook`
- `apply FoxEnhanced transform`
- `run action with FoxEnhanced hooks`

Core changes should not read like:

- embedded FoxEnhanced business logic
- silent module replacement
- non-obvious runtime mutation of upstream internals

That difference is what keeps the patch system understandable for users, contributors, and future
upstream rebases.
