import '@testing-library/jest-dom/vitest'

// jsdom's localStorage can be degraded in some vitest/jsdom builds; ensure it works.
if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') {
  const store: Record<string, string> = {}
  const mockLocalStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v)
    },
    removeItem: (k: string) => {
      delete store[k]
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k]
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true })
}

// jsdom lacks matchMedia, which Ant Design's responsive components use.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
