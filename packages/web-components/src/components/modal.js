import { SoOverlay } from './overlay.js';

/**
 * so-modal — Centered modal overlay with focus trap.
 *
 * Attributes:
 *   trigger-selector  — CSS selector for external open triggers.
 *   open              — Reflects the current open state.
 *
 * Events:
 *   so:modal:open   — Fired when the modal opens.
 *   so:modal:close  — Fired when the modal closes.
 *
 * Public API:
 *   open()    — Open the modal.
 *   close()   — Close the modal.
 *   toggle()  — Toggle open state.
 *
 * Markup:
 *   <so-modal trigger-selector=".open-modal">
 *     <div data-modal-panel class="so-modal__panel">
 *       <button data-modal-close>Close</button>
 *       <!-- content -->
 *     </div>
 *   </so-modal>
 */
export class SoModal extends SoOverlay {
  _openClass = 'so-modal--open';
  _bodyLockClass = 'so-body-locked';
  _panelAttr = 'data-modal-panel';
  _closeAttr = 'data-modal-close';
  _triggerAttr = 'trigger-selector';
  _eventPrefix = 'so:modal';
}
