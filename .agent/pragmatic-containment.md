# Pragmatic Containment Protocol

Treat this as a mandatory decision protocol for AI agents and contributors working on FoxEnhanced.

Its purpose is simple:

- preserve a small rebase surface against Mullvad upstream
- keep FoxEnhanced logic visibly fork-owned
- block convenience edits to Mullvad-owned code when a credible isolated path exists

## Standing Rule

Before editing any Mullvad-owned file, run a containment check.

The containment check is not optional. Upstream edits require explicit failure of the fork-owned options below.

## Containment Ladder

Evaluate options in this order:

1. implement in `src/fox-enhancements/`
2. reuse an existing FoxEnhanced registry, runtime, wrapper, transform, or storage key
3. use additive UI or bootstrap behavior from the FoxEnhanced layer
4. add a very small generic hook in upstream code only if the first three options fail

Stop at the first option that is technically honest and maintainable.

Do not skip directly to upstream edits because they are faster.

## Upstream Touch Budget

A Mullvad-owned file may be edited only when all of these are true:

- the feature cannot be delivered from fork-owned files alone
- the change cannot be expressed as a registry, wrapper, transform, bootstrap hook, or additive UI
- the upstream change is generic and audit-friendly
- FoxEnhanced-specific behavior still lives primarily in `src/fox-enhancements/`

If any item above is false, do not touch upstream code.

## Required Agent Output

When an AI agent decides an upstream edit is necessary, it must state a short containment note before making the change:

- why the fork-owned path failed
- what smallest upstream hook is being added
- why the change is generic instead of FoxEnhanced-specific

This keeps the decision reviewable during rebases and code review.

## Test Isolation Rule

FoxEnhanced-specific tests, mocks, and setup should live under `src/fox-enhancements/tests/` unless there is a strong reason they must be shared repo-wide.

Prefer:

- FoxEnhanced-owned Vitest setup files
- FoxEnhanced-owned mocks and fixtures
- test imports that point back into fork-owned source

Avoid expanding shared root test scaffolding for fork-only needs when an isolated FoxEnhanced test helper is sufficient.

## Anti-Patterns

Do not normalize these behaviors:

- editing upstream code to avoid writing a small fork-owned adapter
- placing FoxEnhanced test helpers in shared root setup by default
- embedding FoxEnhanced product rules directly into Mullvad business logic
- solving an additive UI problem by teaching upstream enums or routing about FoxEnhanced unless that hook is genuinely required

## Review Standard

The preferred diff reads like:

- add FoxEnhanced-owned file
- register FoxEnhanced behavior
- consume small generic hook
- add isolated FoxEnhanced test

The diff should not read like:

- fork logic spread through upstream modules
- shared test scaffolding changed for fork-only behavior
- Mullvad-owned files absorbing FoxEnhanced product rules
