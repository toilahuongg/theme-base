import { emit } from '../helpers.js';

/**
 * so-announcement-bar — Top banner with dismiss and optional carousel.
 *
 * Attributes:
 *   dismissible    — Show dismiss button.
 *   auto-rotate    — Rotate through multiple announcements (ms interval).
 *   storage-key    — localStorage key for dismissed state (default: "so:announcement").
 *
 * Events:
 *   so:announcement:dismiss  — When dismissed.
 *   so:announcement:rotate   — When rotating to next message.
 *
 * Public API:
 *   dismiss()       — Dismiss and remember.
 *   show()          — Show the bar.
 *   isDismissed()   — Check if dismissed.
 */
export class SoAnnouncementBar extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    // Check if previously dismissed
    if (this.hasAttribute('storage-key') && this.isDismissed()) {
      this.hidden = true;
    }

    // Dismiss button
    const dismissBtn = this.querySelector('[data-announcement-dismiss]');
    dismissBtn?.addEventListener('click', () => this.dismiss());

    // Auto-rotate through messages
    if (this.hasAttribute('auto-rotate')) {
      this._startRotation();
    }

    this._connected = true;
  }

  disconnectedCallback() {
    if (this._rotationTimer) {
      clearInterval(this._rotationTimer);
    }
    this._connected = false;
  }

  /** Dismiss the bar and remember. */
  dismiss() {
    this.hidden = true;
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      localStorage.setItem(key, 'true');
    } catch { /* storage unavailable */ }
    emit(this, 'so:announcement:dismiss', {});
  }

  /** Show the bar. */
  show() {
    this.hidden = false;
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      localStorage.removeItem(key);
    } catch { /* storage unavailable */ }
  }

  /** Check if previously dismissed. */
  isDismissed() {
    const key = this.getAttribute('storage-key') || 'so:announcement-dismissed';
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  _startRotation() {
    const messages = this.querySelectorAll('[data-announcement-message]');
    if (messages.length <= 1) return;

    let index = 0;
    const interval = Number(this.getAttribute('auto-rotate')) || 5000;

    this._rotationTimer = setInterval(() => {
      index = (index + 1) % messages.length;
      messages.forEach((msg, i) => {
        msg.hidden = i !== index;
      });
      emit(this, 'so:announcement:rotate', { index });
    }, interval);
  }
}
