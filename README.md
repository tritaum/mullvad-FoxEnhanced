# Mullvad FoxEnhanced

Mullvad FoxEnhanced is an unofficial, Firefox-first fork of the Mullvad Browser Extension.

> [!IMPORTANT]
> Mullvad FoxEnhanced is intended to behave 1:1 with the official Mullvad extension by default.
> This fork only adds cautious, reviewed patches to improve the experience for Firefox users.
> Upstream behavior remains the baseline, and any extra functionality should stay additive,
> manually consented, and configurable.

The goal of this fork is not to weaken Mullvad's privacy standards or ship surprise behavior. The
goal is to preserve the official extension's defaults and baseline behavior while making room for
extra features that some Firefox users may want.

Current FoxEnhanced versioning:

- FoxEnhanced patch version: `0.0.1`
- upstream Mullvad extension version: inherited from upstream `package.json` and manifest

FoxEnhanced patch metadata is intentionally kept separate from the upstream-owned extension version.
That keeps future pulls from the official Mullvad repository easier to merge, because the Mullvad
team remains the source of truth for the main extension version fields.

This repository is intended to behave like a patch layer on top of the official extension. The main
branch should track the latest official Mullvad updates, with FoxEnhanced changes maintained as a
small, reviewable set of patches on top.

## FoxEnhanced Patch Architecture

FoxEnhanced should prefer a contained patch model instead of scattering fork logic across upstream
files.

The preferred home for fork-specific code is `src/fox-enhancements/`. The purpose of that directory
is to keep FoxEnhanced behavior auditable and easy to diff against upstream Mullvad changes.

Manifest and package identity are intentionally treated differently from additive FoxEnhanced UI:

- build-time extension identity stays upstream-owned
- manifest-defined icons and packaged asset references stay upstream-owned
- FoxEnhanced-specific labels, badges, links, and patch metadata should be additive UI driven from hooks

This approach is feasible in this codebase, but not through opaque runtime monkey-patching.
Because this project uses Vue 3, Vite, and ESM modules, hidden code injection and arbitrary module
rewriting would be harder to verify and easier to distrust. The safer approach is a pragmatic one:
keep upstream behavior as the baseline, add named extension points in a few core places, and keep
the fork-owned logic behind those extension points.

Current recommended hook model:

- **bootstrap hooks**: popup and options `main.ts`, plus `background/main.ts`, may invoke
  FoxEnhanced bootstrap hooks before mount or immediately after baseline startup
- **UI insertion hooks**: additive FoxEnhanced panels, cards, labels, or tabs should attach from
  top-level UI containers instead of rewriting leaf components where possible
- **derived-data hooks**: transformed lists, recommendation sets, or view models should prefer
  explicit transform hooks over in-place rewrites of upstream logic
- **action wrappers**: when FoxEnhanced needs before/after behavior around an operation, wrap the
  action through a named helper instead of replacing the whole upstream implementation

Core-facing contract:

- upstream files may **invoke** named FoxEnhanced hook points
- fork-specific logic should live in `src/fox-enhancements/`
- hook APIs should be explicit and typed
- additive behavior is preferred first, before/after wrapping second, full replacement only when
  there is no safe additive option

Good hook boundaries in this repository today:

- popup `main.ts`
- options `main.ts`
- background `main.ts`
- selected composables for additive transforms or wrappers
- selected top-level UI containers for additive UI surfaces

What is not recommended:

- rewriting random upstream modules through Vite aliases
- monkey-patching arbitrary module imports at runtime
- patching compiled Vue component internals
- replacing upstream logic wholesale when an additive wrapper is enough
- hiding fork behavior in magic build transforms that make attestation harder

This is the target containment model for future FoxEnhanced work. The repository is not yet fully
migrated to it, so new patches should move toward this architecture incrementally rather than
pretend the migration is already complete.

## Fork principles

- upstream defaults stay the defaults here
- extra functionality should be additive, manually consented, and configurable
- Firefox desktop usage is the primary product target
- the main branch should always pull in the latest official Mullvad extension updates
- this fork is not affiliated with or endorsed by Mullvad VPN AB

## Download

This repository is intended to be built locally for now:

- run `npm run build`
- run `npm run pack:xpi`
- load the generated `.xpi` temporarily in Firefox from `about:debugging#/runtime/this-firefox`

If you need the official Mullvad release instead of this fork, use Mullvad's official download page:
[Mullvad Browser Extension download](https://mullvad.net/en/download/browser/extension).

## Upstream relationship

This project is based on the official upstream repository:

- source: [mullvad/browser-extension](https://github.com/mullvad/browser-extension)
- upstream releases: [GitHub Releases](https://github.com/mullvad/browser-extension/releases)

The codebase remains GPL-licensed. However, upstream branding and logos belong to Mullvad. This
fork therefore identifies itself as an unofficial fork in documentation and additive UI, while
keeping build-time extension identity aligned with upstream.

From a maintenance perspective, this repository should be treated as an enhancement layer over the
official extension rather than a long-lived divergence from it.

## Development

### **Environment**

Build with:

- Node 24 LTS
- Npm 11

_If you use `nvm`, run `nvm use` to automatically set these versions._

For:

- Firefox: last version (>91.1.0)

### **Developing**

The first time, use `npm install` to install the necessary packages.

To start the extension in a a temporary and clean browser:

- use `npm run dev` to automatically rebuild the extension when changes are saved.
- use `npm start` in another terminal to start a development instance of Firefox with the extension
  loaded. The extension will automatically reload when changes are saved.

The developer tools can be started by clicking on the `inspect` in the debugging tab (automatically
opened).

### **Building**

- use `npm run build` to build the extension **first**
- use `npm run pack:xpi` to create `.xpi` file in the root folder

_There are other build options which you can view in `package.json`._

### **Testing the extension in your browser**

You can only install the extension temporarily when it is not signed by Mozilla. To do so:

- open Firefox
- enter "about:debugging#/runtime/this-firefox" in the URL bar
- click "Load Temporary Add-on"
- open `extension.xpi` file.

The extension will automatically unload when Firefox is closed.

### **Testing restart and persisting features**

You can use the `restart` script to test restart and persisting features (like settings saved to
local storage). It will require some manual configuration:

- go to `about:profiles` and create a new Firefox profile
- go to `package.json` and change the `restart` script with your own Firefox profile path
- go to `about:config` and set both `extensions.webextensions.keepStorageOnUninstall` and
  `extensions.webextensions.keepUuidOnUninstall` to `true`.

[Learn more](https://extensionworkshop.com/documentation/develop/testing-persistent-and-restart-features/)

## Permissions

This fork keeps the same default permissions as the upstream Mullvad extension:

- `management` to be able to recommend third party extensions
- `privacy` to disable webRTC and check HTTPS-Only status
- `storage` to save preferences
- `search` to recommend other search engines
- `*://*.mullvad.net/*` to get proxy servers list and display your connection information (See
  `Network requests` for details)

The following permissions are optional, but are needed to use the proxy feature:

- `proxy` to configure and use Mullvad proxy servers
- `tabs` to show proxy settings from active tab
- `<all_urls>` to specify a proxy configuration per domain (each request needs to be intercepted)

_Permissions are automatically accepted when testing the extension._

## Network requests

Two external network requests are made by the extension:

- `api.mullvad.net` to get the lastest proxy servers (Frequency: each time the
  `Select proxy server location` drawer is opened)
- `am.i.mullvad.net` to get the connection information (Frequency: each time the popup is started
  and each time the proxy is connected/disconnected)

_External links are marked with this icon_
![External Link icon](https://github.com/feathericon/feathericon/blob/master/src/svg/link-external.svg)

## Source code

Source code for the upstream project is available in the
[official Github repo](https://github.com/mullvad/browser-extension).
