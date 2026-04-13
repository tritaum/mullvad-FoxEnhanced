import { createApp, type App as VueApp } from 'vue';

import { registerFoxEnhancementPatch } from '../modules';
import FoxEnhancedAbout from './FoxEnhancedAbout.vue';

const foxEnhancedAboutMountId = 'fox-enhancements-about';

interface FoxEnhancedAboutControllerState {
  observer?: MutationObserver;
  mountedApp?: VueApp;
  mountedNode?: HTMLElement;
  hiddenAboutRow?: HTMLElement;
}

function findAboutHeaderRow() {
  const aboutHeaderRows = Array.from(
    document.querySelectorAll<HTMLDivElement>('div.flex.items-center.p-3.pb-1'),
  );

  for (const aboutHeaderRow of aboutHeaderRows) {
    const hasChangelogLink = !!aboutHeaderRow.querySelector(
      'a[href="https://github.com/mullvad/browser-extension/releases"]',
    );
    const hasSourceLink = !!aboutHeaderRow.querySelector(
      'a[href="https://github.com/mullvad/browser-extension"]',
    );

    if (hasChangelogLink && hasSourceLink) {
      return aboutHeaderRow;
    }
  }

  return undefined;
}

function hideUpstreamAboutHeaderRow(state: FoxEnhancedAboutControllerState, aboutHeaderRow: HTMLElement) {
  state.hiddenAboutRow = aboutHeaderRow;
  aboutHeaderRow.style.display = 'none';
}

function restoreUpstreamAboutHeaderRow(state: FoxEnhancedAboutControllerState) {
  state.hiddenAboutRow?.style.removeProperty('display');
  state.hiddenAboutRow = undefined;
}

function mountFoxEnhancedAbout(state: FoxEnhancedAboutControllerState) {
  const aboutHeaderRow = findAboutHeaderRow();
  if (!aboutHeaderRow?.parentElement) {
    return;
  }

  hideUpstreamAboutHeaderRow(state, aboutHeaderRow);

  if (!state.mountedNode) {
    const mountNode = document.createElement('div');
    mountNode.id = foxEnhancedAboutMountId;

    const aboutApp = createApp(FoxEnhancedAbout);
    aboutApp.mount(mountNode);

    state.mountedNode = mountNode;
    state.mountedApp = aboutApp;
  }

  if (state.mountedNode.previousElementSibling !== aboutHeaderRow) {
    aboutHeaderRow.insertAdjacentElement('afterend', state.mountedNode);
  }
}

function startFoxEnhancedAboutController() {
  const state: FoxEnhancedAboutControllerState = {};

  state.observer = new MutationObserver(() => {
    mountFoxEnhancedAbout(state);
  });

  state.observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  mountFoxEnhancedAbout(state);

  return state;
}

function stopFoxEnhancedAboutController(state: FoxEnhancedAboutControllerState | undefined) {
  if (!state) {
    return;
  }

  state.observer?.disconnect();
  state.mountedApp?.unmount();
  state.mountedNode?.remove();
  restoreUpstreamAboutHeaderRow(state);
}

let controllerState: FoxEnhancedAboutControllerState | undefined;

registerFoxEnhancementPatch({
  id: 'fox-enhanced-about',
  label: 'FoxEnhanced About',
  description: 'Replaces the upstream About header with fork-owned FoxEnhanced metadata.',
  targets: ['options'],
  defaultEnabled: false,
  setup() {
    controllerState ??= startFoxEnhancedAboutController();
  },
  teardown() {
    stopFoxEnhancedAboutController(controllerState);
    controllerState = undefined;
  },
});
