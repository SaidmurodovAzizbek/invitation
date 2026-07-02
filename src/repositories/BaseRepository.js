/**
 * BaseRepository — Universal frontend data abstraction layer.
 *
 * Provides a complete CRUD interface backed by a configurable storage adapter.
 * Default storage: localStorage (perfect for frontend-only apps).
 *
 * Features:
 *   - Full CRUD (create, read, update, delete)
 *   - Filtering, sorting, pagination
 *   - Data validation via schema hooks
 *   - Event-based reactivity (onChange listeners)
 *   - Automatic timestamps (createdAt, updatedAt)
 *   - UUID generation for unique IDs
 *
 * Usage:
 *   Extend this class for each entity (e.g., InvitationRepository).
 *   Override `validate()` to add domain-specific validation.
 */

import { StorageAdapter } from '../storage/StorageAdapter';

export class BaseRepository {
  /**
   * @param {string} collectionName — unique key for this entity's storage
   * @param {object} [options]
   * @param {StorageAdapter} [options.storage] — custom storage adapter (defaults to localStorage adapter)
   * @param {function} [options.validate] — optional validation function (item) => { valid, errors }
   */
  constructor(collectionName, options = {}) {
    this.collectionName = collectionName;
    this.storage = options.storage || new StorageAdapter();
    this.validateFn = options.validate || null;
    this._listeners = [];
  }

  // ─── Core CRUD ──────────────────────────────────────────────

  /**
   * Get all items in this collection.
   * @returns {Array<object>}
   */
  getAll() {
    return this.storage.get(this.collectionName) || [];
  }

  /**
   * Get a single item by ID.
   * @param {string} id
   * @returns {object|null}
   */
  getById(id) {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Create a new item.
   * Automatically assigns `id`, `createdAt`, `updatedAt`.
   * @param {object} data — the data to store (without id)
   * @returns {{ success: boolean, data?: object, errors?: string[] }}
   */
  create(data) {
    const validation = this._validate(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const now = new Date().toISOString();
    const newItem = {
      id: this._generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const items = this.getAll();
    items.push(newItem);
    this._save(items);

    return { success: true, data: newItem };
  }

  /**
   * Update an existing item by ID (partial update / merge).
   * @param {string} id
   * @param {object} updates — fields to merge into the existing item
   * @returns {{ success: boolean, data?: object, errors?: string[] }}
   */
  update(id, updates) {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return { success: false, errors: [`Item with id "${id}" not found`] };
    }

    const merged = { ...items[index], ...updates, updatedAt: new Date().toISOString() };

    // Prevent overwriting system fields
    merged.id = id;
    merged.createdAt = items[index].createdAt;

    const validation = this._validate(merged);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    items[index] = merged;
    this._save(items);

    return { success: true, data: merged };
  }

  /**
   * Delete an item by ID.
   * @param {string} id
   * @returns {{ success: boolean, errors?: string[] }}
   */
  delete(id) {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return { success: false, errors: [`Item with id "${id}" not found`] };
    }

    items.splice(index, 1);
    this._save(items);

    return { success: true };
  }

  /**
   * Delete all items in this collection.
   */
  clear() {
    this._save([]);
  }

  // ─── Query Helpers ──────────────────────────────────────────

  /**
   * Find items matching a filter function.
   * @param {function} predicate — (item) => boolean
   * @returns {Array<object>}
   */
  find(predicate) {
    return this.getAll().filter(predicate);
  }

  /**
   * Find a single item matching a filter function.
   * @param {function} predicate — (item) => boolean
   * @returns {object|null}
   */
  findOne(predicate) {
    return this.getAll().find(predicate) || null;
  }

  /**
   * Check if any item matches the predicate.
   * @param {function} predicate
   * @returns {boolean}
   */
  exists(predicate) {
    return this.getAll().some(predicate);
  }

  /**
   * Get the count of all items (or filtered).
   * @param {function} [predicate] — optional filter
   * @returns {number}
   */
  count(predicate) {
    if (predicate) {
      return this.find(predicate).length;
    }
    return this.getAll().length;
  }

  /**
   * Advanced query with filtering, sorting, and pagination.
   *
   * @param {object} [options]
   * @param {function} [options.filter] — (item) => boolean
   * @param {string}   [options.sortBy] — field name to sort by
   * @param {'asc'|'desc'} [options.sortOrder] — sort direction (default: 'asc')
   * @param {number}   [options.page] — page number (1-based)
   * @param {number}   [options.limit] — items per page
   * @returns {{ data: Array, total: number, page: number, totalPages: number }}
   */
  query({ filter, sortBy, sortOrder = 'asc', page, limit } = {}) {
    let result = this.getAll();

    // Filter
    if (filter) {
      result = result.filter(filter);
    }

    const total = result.length;

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        let comparison;
        if (typeof valA === 'string') {
          comparison = valA.localeCompare(valB);
        } else {
          comparison = valA - valB;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    let totalPages = 1;
    let currentPage = 1;

    if (page && limit) {
      totalPages = Math.ceil(total / limit);
      currentPage = Math.min(page, totalPages) || 1;
      const startIndex = (currentPage - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);
    }

    return {
      data: result,
      total,
      page: currentPage,
      totalPages,
    };
  }

  // ─── Bulk Operations ───────────────────────────────────────

  /**
   * Create multiple items at once.
   * @param {Array<object>} dataArray
   * @returns {{ success: boolean, data?: Array<object>, errors?: string[] }}
   */
  createMany(dataArray) {
    const results = [];
    const errors = [];

    for (const data of dataArray) {
      const result = this.create(data);
      if (result.success) {
        results.push(result.data);
      } else {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      return { success: false, data: results, errors };
    }

    return { success: true, data: results };
  }

  /**
   * Replace all data in the collection (e.g., import from JSON).
   * @param {Array<object>} items
   */
  replaceAll(items) {
    this._save(items);
  }

  // ─── Reactivity (Event Listeners) ──────────────────────────

  /**
   * Subscribe to data changes in this collection.
   * @param {function} listener — (items: Array) => void
   * @returns {function} unsubscribe function
   */
  onChange(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  }

  // ─── Export / Import ───────────────────────────────────────

  /**
   * Export all data as a JSON string.
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  }

  /**
   * Import data from a JSON string. Replaces existing data.
   * @param {string} json
   */
  fromJSON(json) {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        this._save(data);
      }
    } catch (e) {
      console.error(`[${this.collectionName}] Failed to import JSON:`, e);
    }
  }

  // ─── Internal Helpers ──────────────────────────────────────

  /** @private */
  _save(items) {
    this.storage.set(this.collectionName, items);
    this._notifyListeners(items);
  }

  /** @private */
  _validate(data) {
    if (this.validateFn) {
      return this.validateFn(data);
    }
    return { valid: true, errors: [] };
  }

  /** @private */
  _notifyListeners(items) {
    for (const listener of this._listeners) {
      try {
        listener(items);
      } catch (e) {
        console.error(`[${this.collectionName}] Listener error:`, e);
      }
    }
  }

  /** @private — generates a UUID v4 */
  _generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
