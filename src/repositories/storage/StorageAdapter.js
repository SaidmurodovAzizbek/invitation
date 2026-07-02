/**
 * StorageAdapter — Abstraction over the actual storage mechanism.
 *
 * Default implementation uses localStorage.
 * Can be extended/replaced with:
 *   - SessionStorage
 *   - IndexedDB
 *   - In-memory storage (for tests)
 *   - Remote API wrapper
 *
 * All repository classes depend on this adapter, not on localStorage directly.
 * This makes it trivial to swap storage backends without touching business logic.
 */

export class StorageAdapter {
  /**
   * Retrieve data by key.
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`[StorageAdapter] Error reading key "${key}":`, e);
      return null;
    }
  }

  /**
   * Store data by key.
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[StorageAdapter] Error writing key "${key}":`, e);
    }
  }

  /**
   * Remove data by key.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[StorageAdapter] Error removing key "${key}":`, e);
    }
  }

  /**
   * Check if a key exists in storage.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Clear all stored data.
   */
  clearAll() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('[StorageAdapter] Error clearing storage:', e);
    }
  }
}

/**
 * MemoryStorageAdapter — In-memory storage for testing and SSR.
 * Same interface as StorageAdapter but data lives only in RAM.
 */
export class MemoryStorageAdapter {
  constructor() {
    this._store = new Map();
  }

  get(key) {
    const raw = this._store.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  set(key, value) {
    this._store.set(key, JSON.stringify(value));
  }

  remove(key) {
    this._store.delete(key);
  }

  has(key) {
    return this._store.has(key);
  }

  clearAll() {
    this._store.clear();
  }
}

/**
 * SessionStorageAdapter — Uses sessionStorage instead of localStorage.
 * Data persists only for the browser tab session.
 */
export class SessionStorageAdapter {
  get(key) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`[SessionStorageAdapter] Error reading key "${key}":`, e);
      return null;
    }
  }

  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[SessionStorageAdapter] Error writing key "${key}":`, e);
    }
  }

  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error(`[SessionStorageAdapter] Error removing key "${key}":`, e);
    }
  }

  has(key) {
    return sessionStorage.getItem(key) !== null;
  }

  clearAll() {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('[SessionStorageAdapter] Error clearing storage:', e);
    }
  }
}
