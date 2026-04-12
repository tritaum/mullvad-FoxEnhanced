import type { App } from 'vue';

export type FoxEnhancementUiTarget = 'popup' | 'options';
export type FoxEnhancementTarget = FoxEnhancementUiTarget | 'background';

export interface FoxEnhancementUiBootstrapContext {
  app: App;
  target: FoxEnhancementUiTarget;
}

export interface FoxEnhancementBackgroundBootstrapContext {
  target: 'background';
}

export type FoxEnhancementUiBootstrapHook = (
  context: FoxEnhancementUiBootstrapContext,
) => void | Promise<void>;

export type FoxEnhancementBackgroundBootstrapHook = (
  context: FoxEnhancementBackgroundBootstrapContext,
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

const popupBootstrapHooks: FoxEnhancementUiBootstrapHook[] = [];
const optionsBootstrapHooks: FoxEnhancementUiBootstrapHook[] = [];
const backgroundBootstrapHooks: FoxEnhancementBackgroundBootstrapHook[] = [];

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
}

export async function runOptionsBootstrapHooks(app: App) {
  for (const hook of optionsBootstrapHooks) {
    await hook({ app, target: 'options' });
  }
}

export async function runBackgroundBootstrapHooks() {
  for (const hook of backgroundBootstrapHooks) {
    await hook({ target: 'background' });
  }
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
