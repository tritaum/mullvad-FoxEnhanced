import { vi } from 'vitest';

Object.assign(globalThis, { __DEV__: false });

// Mock browser API
global.browser = {
  runtime: {
    getManifest: vi.fn(() => ({
      version: '0.9.8',
      name: 'Mullvad Browser Extension',
    })),
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
    },
  },
  search: {
    get: vi.fn(async () => []),
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
  },
} as unknown as typeof browser;
