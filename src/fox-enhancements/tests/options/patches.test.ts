import { createApp, defineComponent, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedOptionsActiveTab = ref('settings');

vi.mock('@/composables/useStore', () => ({
  default: () => ({
    optionsActiveTab: mockedOptionsActiveTab,
  }),
}));

vi.mock('@/components/OptionsTabs/SettingsTab.vue', () => ({
  default: defineComponent({
    name: 'MockSettingsTab',
    template: '<div>Settings body</div>',
  }),
}));

vi.mock('@/components/OptionsTabs/ProxyTab.vue', () => ({
  default: defineComponent({
    name: 'MockProxyTab',
    template: '<div>Proxy body</div>',
  }),
}));

vi.mock('@/components/OptionsTabs/ImportExportTab.vue', () => ({
  default: defineComponent({
    name: 'MockImportExportTab',
    template: '<div>Import/Export body</div>',
  }),
}));

vi.mock('@/components/OptionsTabs/AboutTab.vue', () => ({
  default: defineComponent({
    name: 'MockAboutTab',
    template: '<div>About body</div>',
  }),
}));

import { runOptionsBootstrapHooks, stopAllFoxEnhancementPatchRuntimesForTesting } from '../../bootstrap';
import {
  getRegisteredFoxEnhancementPatch,
  registerFoxEnhancementPatch,
  setFoxEnhancementPatchEnabled,
} from '../../modules';
import { installMockBrowserStorage } from '../testUtils/mockBrowserStorage';

import OptionsApp from '@/options/App.vue';

async function flushUi() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('FoxEnhanced options modules', () => {
  beforeEach(async () => {
    installMockBrowserStorage();
    mockedOptionsActiveTab.value = 'settings';
    document.body.innerHTML = '<div id="app"></div>';

    if (!getRegisteredFoxEnhancementPatch('fox-enhanced-menu')) {
      await import('../../options/FoxEnhancedMenu');
    }

    if (!getRegisteredFoxEnhancementPatch('fox-enhanced-about')) {
      await import('../../options/FoxEnhancedAbout');
    }
  });

  afterEach(async () => {
    await stopAllFoxEnhancementPatchRuntimesForTesting();
    document.body.innerHTML = '';
  });

  it('renders the FoxEnhanced tab as a native tab pane in the correct order', async () => {
    registerFoxEnhancementPatch({
      id: 'test-toggleable-patch',
      label: 'Test Toggleable Patch',
      description: 'A patch visible in the menu list.',
      targets: ['options'],
      setup: vi.fn(),
      teardown: vi.fn(),
    });

    const app = createApp(OptionsApp);
    await runOptionsBootstrapHooks(app);
    app.mount('#app');
    await flushUi();

    const tabLabels = Array.from(document.querySelectorAll('.n-tabs-tab__label')).map((element) =>
      element.textContent?.trim(),
    );
    expect(tabLabels).toEqual(['Settings', 'Proxy', 'Import/Export', 'FoxEnhanced', 'About']);

    const foxEnhancedTab = document.querySelector<HTMLElement>('.n-tabs-tab[data-name="fox-enhanced"]');
    foxEnhancedTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushUi();

    expect(foxEnhancedTab?.classList.contains('n-tabs-tab--active')).toBe(true);
    expect(mockedOptionsActiveTab.value).toBe('fox-enhanced');
    expect(document.body.textContent).toContain('FoxEnhanced Modules');

    app.unmount();
  });

  it('mounts and unmounts the FoxEnhanced about patch cleanly', async () => {
    const aboutPatch = getRegisteredFoxEnhancementPatch('fox-enhanced-about');
    expect(aboutPatch).toBeDefined();

    const aboutHeaderRow = document.createElement('div');
    aboutHeaderRow.className = 'flex items-center p-3 pb-1';
    aboutHeaderRow.innerHTML = `
      <a href="https://github.com/mullvad/browser-extension/releases">0.9.8 | Changelog</a>
      <a href="https://github.com/mullvad/browser-extension">Source code</a>
    `;
    document.body.appendChild(aboutHeaderRow);

    expect(aboutHeaderRow.style.display).toBe('');

    await setFoxEnhancementPatchEnabled('fox-enhanced-about', true);
    await aboutPatch?.setup({
      app: {} as never,
      target: 'options',
    });
    await flushUi();

    expect(aboutHeaderRow.style.display).toBe('none');
    expect(document.getElementById('fox-enhancements-about')).not.toBeNull();
    expect(document.body.textContent).toContain('FoxEnhanced');

    await aboutPatch?.teardown?.({
      app: {} as never,
      target: 'options',
    });
    await flushUi();

    expect(document.getElementById('fox-enhancements-about')).toBeNull();
    expect(aboutHeaderRow.style.display).toBe('');

    await aboutPatch?.setup({
      app: {} as never,
      target: 'options',
    });
    await flushUi();

    expect(document.querySelectorAll('#fox-enhancements-about')).toHaveLength(1);

    await aboutPatch?.teardown?.({
      app: {} as never,
      target: 'options',
    });
  });
});
