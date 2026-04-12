import { createApp, nextTick, type App as VueApp, type ComponentPublicInstance } from 'vue';

import { registerFoxEnhancementModule } from '../modules';
import { registerOptionsBootstrapHook } from '../runtime';
import FoxEnhancedAbout from './FoxEnhancedAbout.vue';

const foxEnhancedAboutMountId = 'fox-enhancements-about';

let mountedAboutApp: VueApp | undefined;
let mountedAboutNode: HTMLElement | undefined;
let foxEnhancedAboutObserver: MutationObserver | undefined;

registerFoxEnhancementModule({
  id: 'fox-enhanced-about',
  label: 'FoxEnhancedAbout',
});

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

function hideUpstreamAboutHeaderRow(aboutHeaderRow: HTMLElement) {
  aboutHeaderRow.style.display = 'none';
}

function resetDetachedMount() {
  if (mountedAboutNode?.isConnected) {
    return;
  }

  mountedAboutApp?.unmount();
  mountedAboutApp = undefined;
  mountedAboutNode = undefined;
}

function mountFoxEnhancedAbout() {
  resetDetachedMount();

  const aboutHeaderRow = findAboutHeaderRow();
  if (!aboutHeaderRow?.parentElement) {
    return;
  }

  hideUpstreamAboutHeaderRow(aboutHeaderRow);

  if (mountedAboutNode) {
    if (mountedAboutNode.previousElementSibling !== aboutHeaderRow) {
      aboutHeaderRow.insertAdjacentElement('afterend', mountedAboutNode);
    }

    return;
  }

  const mountNode = document.createElement('div');
  mountNode.id = foxEnhancedAboutMountId;
  aboutHeaderRow.insertAdjacentElement('afterend', mountNode);

  const aboutApp = createApp(FoxEnhancedAbout);
  aboutApp.mount(mountNode);

  mountedAboutNode = mountNode;
  mountedAboutApp = aboutApp;
}

function startFoxEnhancedAboutObserver() {
  if (foxEnhancedAboutObserver) {
    return;
  }

  foxEnhancedAboutObserver = new MutationObserver(() => {
    mountFoxEnhancedAbout();
  });

  foxEnhancedAboutObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  mountFoxEnhancedAbout();
}

registerOptionsBootstrapHook(({ app }) => {
  let initialized = false;

  app.mixin({
    mounted() {
      const component = this as ComponentPublicInstance;

      if (initialized || component !== component.$root) {
        return;
      }

      initialized = true;
      void nextTick().then(() => {
        startFoxEnhancedAboutObserver();
      });
    },
  });
});
