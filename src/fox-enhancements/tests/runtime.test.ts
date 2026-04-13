import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getFoxEnhancementPatchStatuses,
  registerFoxEnhancementPatch,
  resetFoxEnhancementPatchRegistryForTesting,
  setFoxEnhancementPatchEnabled,
} from '../modules';
import {
  createFoxEnhancementPatchRuntime,
  stopAllFoxEnhancementPatchRuntimesForTesting,
} from '../runtime';
import { installMockBrowserStorage } from './testUtils/mockBrowserStorage';

describe('FoxEnhanced patch runtime', () => {
  beforeEach(() => {
    installMockBrowserStorage();
    resetFoxEnhancementPatchRegistryForTesting();
  });

  afterEach(async () => {
    await stopAllFoxEnhancementPatchRuntimesForTesting();
    resetFoxEnhancementPatchRegistryForTesting();
  });

  it('defaults non-required patches to disabled', async () => {
    registerFoxEnhancementPatch({
      id: 'patch-a',
      label: 'Patch A',
      targets: ['options'],
      setup: vi.fn(),
    });

    const statuses = await getFoxEnhancementPatchStatuses();
    expect(statuses).toEqual([
      expect.objectContaining({
        id: 'patch-a',
        enabled: false,
        required: false,
      }),
    ]);
  });

  it('always keeps required patches enabled', async () => {
    registerFoxEnhancementPatch({
      id: 'required-patch',
      label: 'Required Patch',
      required: true,
      targets: ['options'],
      setup: vi.fn(),
    });

    await setFoxEnhancementPatchEnabled('required-patch', false);

    const statuses = await getFoxEnhancementPatchStatuses();
    expect(statuses[0]).toEqual(
      expect.objectContaining({
        id: 'required-patch',
        enabled: true,
        required: true,
      }),
    );
  });

  it('rejects duplicate patch ids', () => {
    registerFoxEnhancementPatch({
      id: 'duplicate',
      label: 'Duplicate',
      targets: ['options'],
      setup: vi.fn(),
    });

    expect(() => {
      registerFoxEnhancementPatch({
        id: 'duplicate',
        label: 'Duplicate Again',
        targets: ['options'],
        setup: vi.fn(),
      });
    }).toThrow(/already registered/i);
  });

  it('enables, disables, and re-enables a patch through storage changes', async () => {
    const setup = vi.fn();
    const teardown = vi.fn();

    registerFoxEnhancementPatch({
      id: 'toggleable',
      label: 'Toggleable',
      targets: ['options'],
      setup,
      teardown,
    });

    const runtime = createFoxEnhancementPatchRuntime({
      app: {} as never,
      target: 'options',
    });

    await runtime.start();

    expect(setup).not.toHaveBeenCalled();

    await setFoxEnhancementPatchEnabled('toggleable', true);
    expect(setup).toHaveBeenCalledTimes(1);

    await setFoxEnhancementPatchEnabled('toggleable', false);
    expect(teardown).toHaveBeenCalledTimes(1);

    await setFoxEnhancementPatchEnabled('toggleable', true);
    expect(setup).toHaveBeenCalledTimes(2);

    await Promise.resolve();
    await runtime.stop();
    expect(teardown).toHaveBeenCalledTimes(2);
  });

  it('reacts live when storage changes happen outside the setter helper', async () => {
    const setup = vi.fn();
    const teardown = vi.fn();

    registerFoxEnhancementPatch({
      id: 'external-change',
      label: 'External Change',
      targets: ['background'],
      setup,
      teardown,
    });

    const storage = installMockBrowserStorage();
    const runtime = createFoxEnhancementPatchRuntime({
      target: 'background',
    });

    await runtime.start();
    await storage.flushChange({
      foxEnhancementPatchStates: {
        'external-change': true,
      },
    });

    expect(setup).toHaveBeenCalledTimes(1);

    await storage.flushChange({
      foxEnhancementPatchStates: {
        'external-change': false,
      },
    });

    expect(teardown).toHaveBeenCalledTimes(1);
  });
});
