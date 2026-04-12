# Uncodixfy

Fundamental UI/UX guidance for FoxEnhanced, inspired by `cyxzdev/Uncodixfy`:
https://github.com/cyxzdev/Uncodixfy

Treat this as a baseline design skill for any fork-owned UI work.

## Core Rule

Prefer normal, product-matched interface decisions over flashy ones. If a UI choice looks like a default AI-generated shortcut, do the calmer and more functional version instead.

## Project Defaults

- Reuse the extension's existing palette first: `--dark-blue`, `--blue`, `--light-grey`, `--white`, `--yellow`, `--success`, `--error`.
- Match the repo's current typography and spacing before introducing new visual language.
- Prefer simple section headers, standard borders, and small-radius containers.
- Use badges only when they communicate real state, version, source, or module status.

## Avoid By Default

- Large gradient panels and decorative glow effects.
- Pill overload across every badge and button.
- Heavy shadows or floating-card styling.
- Decorative copy, eyebrow labels, and "premium dashboard" filler.
- Overdesigned layouts that compete with the upstream UI.

## Prefer Instead

- Straightforward sections with a visible header and divider.
- Subtle border separation.
- Small, readable badges with one clear purpose each.
- Muted surfaces using the existing Mullvad extension dark theme.
- Additive UI that feels like it belongs in the product rather than advertising itself.
