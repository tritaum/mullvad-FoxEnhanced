import { vi } from 'vitest';

type StorageState = Record<string, unknown>;
type StorageChanges = Record<string, { oldValue?: unknown; newValue?: unknown }>;
type StorageChangeListener = (changes: StorageChanges, areaName: string) => void;

function cloneValue<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

export function installMockBrowserStorage(initialState: StorageState = {}) {
  const state: StorageState = cloneValue(initialState);
  const listeners = new Set<StorageChangeListener>();

  vi.mocked(browser.storage.local.get).mockImplementation(
    async (keys?: string | string[] | { [key: string]: any } | null) => {
      if (keys === undefined) {
        return cloneValue(state);
      }

      if (keys === null) {
        return {};
      }

      if (typeof keys === 'string') {
        return { [keys]: cloneValue(state[keys]) };
      }

      if (Array.isArray(keys)) {
        return Object.fromEntries(keys.map((key) => [key, cloneValue(state[key])]));
      }

      return Object.fromEntries(
        Object.entries(keys).map(([key, fallback]) => [key, cloneValue(state[key] ?? fallback)]),
      );
    },
  );

  vi.mocked(browser.storage.local.set).mockImplementation(async (values: Record<string, unknown>) => {
    const changes: StorageChanges = {};

    for (const [key, value] of Object.entries(values)) {
      const oldValue = cloneValue(state[key]);
      const newValue = cloneValue(value);
      state[key] = newValue;

      changes[key] = {
        oldValue,
        newValue,
      };
    }

    for (const listener of listeners) {
      listener(changes, 'local');
    }
  });

  vi.mocked(browser.storage.local.remove).mockImplementation(async (keys: string | string[]) => {
    const normalizedKeys = Array.isArray(keys) ? keys : [keys];
    const changes: StorageChanges = {};

    for (const key of normalizedKeys) {
      const oldValue = cloneValue(state[key]);
      delete state[key];

      changes[key] = {
        oldValue,
        newValue: undefined,
      };
    }

    for (const listener of listeners) {
      listener(changes, 'local');
    }
  });

  vi.mocked(browser.storage.onChanged.addListener).mockImplementation((listener: StorageChangeListener) => {
    listeners.add(listener);
  });

  vi.mocked(browser.storage.onChanged.removeListener).mockImplementation(
    (listener: StorageChangeListener) => {
      listeners.delete(listener);
    },
  );

  return {
    state,
    async flushChange(values: Record<string, unknown>) {
      await browser.storage.local.set(values);
    },
  };
}
