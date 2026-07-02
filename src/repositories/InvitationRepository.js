/**
 * InvitationRepository — Domain-specific repository for wedding invitations.
 *
 * Extends BaseRepository with invitation-specific:
 *   - Validation rules
 *   - Query helpers (by template, status, etc.)
 *   - Default data seeding
 *
 * Collection key: "invitations"
 */

import { BaseRepository } from './BaseRepository';

// ─── Validation ──────────────────────────────────────────────

function validateInvitation(data) {
  const errors = [];

  if (!data.groomName || typeof data.groomName !== 'string' || !data.groomName.trim()) {
    errors.push('groomName majburiy maydon');
  }

  if (!data.brideName || typeof data.brideName !== 'string' || !data.brideName.trim()) {
    errors.push('brideName majburiy maydon');
  }

  if (!data.weddingDate) {
    errors.push('weddingDate majburiy maydon');
  }

  if (!data.templateId) {
    errors.push('templateId majburiy maydon');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─── Repository ──────────────────────────────────────────────

export class InvitationRepository extends BaseRepository {
  constructor(options = {}) {
    super('invitations', {
      ...options,
      validate: validateInvitation,
    });
  }

  /**
   * Find all invitations using a specific template.
   * @param {string} templateId
   * @returns {Array<object>}
   */
  getByTemplate(templateId) {
    return this.find((item) => item.templateId === templateId);
  }

  /**
   * Find invitations by status.
   * @param {'draft'|'published'|'archived'} status
   * @returns {Array<object>}
   */
  getByStatus(status) {
    return this.find((item) => item.status === status);
  }

  /**
   * Get all published (active) invitations.
   * @returns {Array<object>}
   */
  getPublished() {
    return this.getByStatus('published');
  }

  /**
   * Get all draft invitations.
   * @returns {Array<object>}
   */
  getDrafts() {
    return this.getByStatus('draft');
  }

  /**
   * Search invitations by groom or bride name.
   * @param {string} searchTerm
   * @returns {Array<object>}
   */
  search(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.find(
      (item) =>
        item.groomName?.toLowerCase().includes(term) ||
        item.brideName?.toLowerCase().includes(term)
    );
  }

  /**
   * Create a new invitation with sensible defaults.
   * @param {object} data
   * @returns {{ success: boolean, data?: object, errors?: string[] }}
   */
  create(data) {
    const withDefaults = {
      status: 'draft',
      venue: '',
      message: '',
      guestCount: 0,
      ...data,
    };
    return super.create(withDefaults);
  }

  /**
   * Publish a draft invitation.
   * @param {string} id
   * @returns {{ success: boolean, data?: object, errors?: string[] }}
   */
  publish(id) {
    return this.update(id, { status: 'published' });
  }

  /**
   * Archive an invitation.
   * @param {string} id
   * @returns {{ success: boolean, data?: object, errors?: string[] }}
   */
  archive(id) {
    return this.update(id, { status: 'archived' });
  }
}
