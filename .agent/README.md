# .agent

This directory holds deeper guidance for contributors and coding agents working in this fork.

This fork should be maintained as a patch layer over the official Mullvad extension, with `main`
kept close to the latest upstream updates whenever practical.

Versioning guidance:

- let Mullvad own the primary extension version fields
- keep FoxEnhanced patch metadata in separate fork-owned files

## Files

- `development-workflow.md`: install, run, test, build, and package flows
- `fox-enhancements.md`: containment model, extension-point guidance, and auditability rules for fork-owned patches
- `project-structure.md`: file hierarchy and where different responsibilities live
- `uncodixfy.md`: fundamental UI/UX skill for fork-owned interface work; use it to avoid generic AI-looking design choices and stay close to the extension's visual language
- `upstream-organization.md`: simple notes on how the original Mullvad team organized the extension and how this fork should interpret that structure

Start with `../AGENTS.md` for the short version, then use the files here when you need more context.
