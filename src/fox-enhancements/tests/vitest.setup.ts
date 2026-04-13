import { vi } from 'vitest';

const browserMock = global.browser as unknown as {
  storage?: {
    local?: {
      get?: ReturnType<typeof vi.fn>;
      set?: ReturnType<typeof vi.fn>;
      remove?: ReturnType<typeof vi.fn>;
    };
    onChanged?: {
      addListener?: ReturnType<typeof vi.fn>;
      removeListener?: ReturnType<typeof vi.fn>;
    };
  };
};

browserMock.storage ??= {};
browserMock.storage.local ??= {
  get: vi.fn(),
  set: vi.fn(),
};

browserMock.storage.local.remove ??= vi.fn();
browserMock.storage.onChanged ??= {
  addListener: vi.fn(),
  removeListener: vi.fn(),
};
