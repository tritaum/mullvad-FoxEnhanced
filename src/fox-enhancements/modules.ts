import type { App } from 'vue';

export type FoxEnhancementUiTarget = 'popup' | 'options';
export type FoxEnhancementTarget = FoxEnhancementUiTarget | 'background';

export interface FoxEnhancementUiContext {
  app: App;
  target: FoxEnhancementUiTarget;
}

export interface FoxEnhancementBackgroundContext {
  target: 'background';
}

export type FoxEnhancementContext = FoxEnhancementUiContext | FoxEnhancementBackgroundContext;

export interface FoxEnhancementPatch {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  targets: FoxEnhancementTarget[];
  defaultEnabled?: boolean;
  setup: (context: FoxEnhancementContext) => void | Promise<void>;
  teardown?: (context: FoxEnhancementContext) => void | Promise<void>;
}

export interface FoxEnhancementPatchStatus {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
  required: boolean;
  targets: FoxEnhancementTarget[];
}

type FoxEnhancementPatchStateMap = Record<string, boolean>;
type FoxEnhancementStorageChange = {
  oldValue?: unknown;
  newValue?: unknown;
};
type FoxEnhancementStorageListener = (
  states: FoxEnhancementPatchStateMap,
  previousStates: FoxEnhancementPatchStateMap,
) => void | Promise<void>;

export const foxEnhancementPatchStatesStorageKey = 'foxEnhancementPatchStates';

const registeredPatches = new Map<string, FoxEnhancementPatch>();

function sanitizePatchStateMap(value: unknown): FoxEnhancementPatchStateMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
}

function getStorageApi() {
  return browser.storage.local;
}

function getStorageChangeApi() {
  return browser.storage.onChanged;
}

export function registerFoxEnhancementPatch(patch: FoxEnhancementPatch) {
  if (registeredPatches.has(patch.id)) {
    throw new Error(`FoxEnhanced patch "${patch.id}" is already registered.`);
  }

  registeredPatches.set(patch.id, {
    ...patch,
    defaultEnabled: patch.required ? true : patch.defaultEnabled ?? false,
  });
}

export function getRegisteredFoxEnhancementPatches() {
  return [...registeredPatches.values()];
}

export function getRegisteredFoxEnhancementPatch(id: string) {
  return registeredPatches.get(id);
}

export async function getStoredFoxEnhancementPatchStates() {
  const storage = getStorageApi();
  const result = await storage.get(foxEnhancementPatchStatesStorageKey);

  return sanitizePatchStateMap(result[foxEnhancementPatchStatesStorageKey]);
}

export function isFoxEnhancementPatchEnabled(
  patch: FoxEnhancementPatch,
  states: FoxEnhancementPatchStateMap = {},
) {
  if (patch.required) {
    return true;
  }

  return states[patch.id] ?? patch.defaultEnabled ?? false;
}

export async function setFoxEnhancementPatchEnabled(id: string, enabled: boolean) {
  const patch = getRegisteredFoxEnhancementPatch(id);
  if (!patch) {
    throw new Error(`FoxEnhanced patch "${id}" is not registered.`);
  }

  if (patch.required) {
    return;
  }

  const storage = getStorageApi();
  const states = await getStoredFoxEnhancementPatchStates();

  states[id] = enabled;

  await storage.set({
    [foxEnhancementPatchStatesStorageKey]: states,
  });
}

export async function getFoxEnhancementPatchStatuses() {
  const states = await getStoredFoxEnhancementPatchStates();

  return getRegisteredFoxEnhancementPatches()
    .map<FoxEnhancementPatchStatus>((patch) => ({
      id: patch.id,
      label: patch.label,
      description: patch.description,
      enabled: isFoxEnhancementPatchEnabled(patch, states),
      required: !!patch.required,
      targets: [...patch.targets],
    }))
    .sort((left, right) => {
      if (left.required !== right.required) {
        return left.required ? -1 : 1;
      }

      return left.label.localeCompare(right.label);
    });
}

export function subscribeToFoxEnhancementPatchStateChanges(listener: FoxEnhancementStorageListener) {
  const storageChangeApi = getStorageChangeApi();

  const handleStorageChange = (
    changes: Record<string, FoxEnhancementStorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local' || !changes[foxEnhancementPatchStatesStorageKey]) {
      return;
    }

    const change = changes[foxEnhancementPatchStatesStorageKey];
    const states = sanitizePatchStateMap(change.newValue);
    const previousStates = sanitizePatchStateMap(change.oldValue);

    void listener(states, previousStates);
  };

  storageChangeApi.addListener(handleStorageChange);

  return () => {
    storageChangeApi.removeListener(handleStorageChange);
  };
}

export function resetFoxEnhancementPatchRegistryForTesting() {
  registeredPatches.clear();
}
