import type { App, ComponentPublicInstance } from 'vue';

import {
  getRegisteredFoxEnhancementPatches,
  getStoredFoxEnhancementPatchStates,
  isFoxEnhancementPatchEnabled,
  subscribeToFoxEnhancementPatchStateChanges,
  type FoxEnhancementBackgroundContext,
  type FoxEnhancementContext,
  type FoxEnhancementPatch,
  type FoxEnhancementTarget,
  type FoxEnhancementUiContext,
  type FoxEnhancementUiTarget,
} from './modules';

export type FoxEnhancementUiBootstrapHook = (
  context: FoxEnhancementUiContext,
) => void | Promise<void>;

export type FoxEnhancementBackgroundBootstrapHook = (
  context: FoxEnhancementBackgroundContext,
) => void | Promise<void>;

export type DerivedDataTransform<TValue, TContext = void> = (
  value: TValue,
  context: TContext,
) => TValue;

export type BeforeActionHook<TArgs extends unknown[]> = (
  context: { args: TArgs },
) => void | Promise<void>;

export type AfterActionHook<TArgs extends unknown[], TResult> = (
  context: { args: TArgs; result: TResult },
) => void | Promise<void>;

export interface FoxEnhancementPatchRuntime {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  sync: () => Promise<void>;
}

const popupBootstrapHooks: FoxEnhancementUiBootstrapHook[] = [];
const optionsBootstrapHooks: FoxEnhancementUiBootstrapHook[] = [];
const backgroundBootstrapHooks: FoxEnhancementBackgroundBootstrapHook[] = [];
const activePatchRuntimes = new Map<FoxEnhancementTarget, FoxEnhancementPatchRuntime>();

function getPatchesForTarget(target: FoxEnhancementTarget) {
  return getRegisteredFoxEnhancementPatches().filter((patch) => patch.targets.includes(target));
}

export function createFoxEnhancementPatchRuntime(
  context: FoxEnhancementContext,
): FoxEnhancementPatchRuntime {
  const activePatches = new Map<string, FoxEnhancementPatch>();
  let unsubscribeFromStorageChanges: (() => void) | undefined;

  async function enablePatch(patch: FoxEnhancementPatch) {
    if (activePatches.has(patch.id)) {
      return;
    }

    await patch.setup(context);
    activePatches.set(patch.id, patch);
  }

  async function disablePatch(patch: FoxEnhancementPatch) {
    if (!activePatches.has(patch.id)) {
      return;
    }

    await patch.teardown?.(context);
    activePatches.delete(patch.id);
  }

  async function sync() {
    const storedStates = await getStoredFoxEnhancementPatchStates();

    for (const patch of getPatchesForTarget(context.target)) {
      const shouldBeEnabled = isFoxEnhancementPatchEnabled(patch, storedStates);

      if (shouldBeEnabled) {
        await enablePatch(patch);
      } else {
        await disablePatch(patch);
      }
    }
  }

  return {
    async start() {
      unsubscribeFromStorageChanges?.();
      unsubscribeFromStorageChanges = subscribeToFoxEnhancementPatchStateChanges(async () => {
        await sync();
      });

      await sync();
    },
    async stop() {
      unsubscribeFromStorageChanges?.();
      unsubscribeFromStorageChanges = undefined;

      for (const patch of [...activePatches.values()].reverse()) {
        await patch.teardown?.(context);
      }

      activePatches.clear();
    },
    sync,
  };
}

async function stopManagedRuntime(target: FoxEnhancementTarget) {
  const runtime = activePatchRuntimes.get(target);
  if (!runtime) {
    return;
  }

  activePatchRuntimes.delete(target);
  await runtime.stop();
}

async function startManagedRuntime(context: FoxEnhancementContext) {
  await stopManagedRuntime(context.target);

  const runtime = createFoxEnhancementPatchRuntime(context);
  activePatchRuntimes.set(context.target, runtime);
  await runtime.start();
}

export function registerPopupBootstrapHook(hook: FoxEnhancementUiBootstrapHook) {
  popupBootstrapHooks.push(hook);
}

export function registerOptionsBootstrapHook(hook: FoxEnhancementUiBootstrapHook) {
  optionsBootstrapHooks.push(hook);
}

export function registerBackgroundBootstrapHook(hook: FoxEnhancementBackgroundBootstrapHook) {
  backgroundBootstrapHooks.push(hook);
}

export async function runPopupBootstrapHooks(app: App) {
  for (const hook of popupBootstrapHooks) {
    await hook({ app, target: 'popup' });
  }

  await startManagedRuntime({ app, target: 'popup' });
}

export async function runOptionsBootstrapHooks(app: App) {
  for (const hook of optionsBootstrapHooks) {
    await hook({ app, target: 'options' });
  }

  app.mixin({
    unmounted() {
      const component = this as ComponentPublicInstance;
      if (component !== component.$root) {
        return;
      }

      void stopManagedRuntime('options');
    },
  });

  await startManagedRuntime({ app, target: 'options' });
}

export async function runBackgroundBootstrapHooks() {
  for (const hook of backgroundBootstrapHooks) {
    await hook({ target: 'background' });
  }

  await startManagedRuntime({ target: 'background' });
}

export function applyDerivedDataTransforms<TValue, TContext>(
  value: TValue,
  transforms: Array<DerivedDataTransform<TValue, TContext>>,
  context: TContext,
) {
  return transforms.reduce((currentValue, transform) => transform(currentValue, context), value);
}

export async function runActionWithHooks<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => TResult | Promise<TResult>,
  args: TArgs,
  beforeHooks: Array<BeforeActionHook<TArgs>> = [],
  afterHooks: Array<AfterActionHook<TArgs, TResult>> = [],
) {
  for (const hook of beforeHooks) {
    await hook({ args });
  }

  const result = await action(...args);

  for (const hook of afterHooks) {
    await hook({ args, result });
  }

  return result;
}

export async function stopAllFoxEnhancementPatchRuntimesForTesting() {
  for (const target of [...activePatchRuntimes.keys()]) {
    await stopManagedRuntime(target);
  }
}
