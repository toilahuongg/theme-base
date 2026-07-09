import { SoOverlay } from './overlay.js';

/**
 * so-drawer — Slide-in drawer from left or right edge.
 *
 * Attributes:
 *   trigger-selector  — CSS selector for external open triggers.
 *   open              — Reflects the current open state.
 *   position          — "left" (default) or "right".
 *
 * Events:
 *   so:drawer:open   — Fired when the drawer opens.
 *   so:drawer:close  — Fired when the drawer closes.
 *
 * Public API:
 *   open()    — Open the drawer.
 *   close()   — Close the drawer.
 *   toggle()  — Toggle open state.
 *
 * Markup:
 *   <so-drawer trigger-selector=".open-cart">
 *     <div data-drawer-panel class="so-drawer__panel">
 *       <button data-drawer-close>Close</button>
 *       <!-- content -->
 *     </div>
 *   </so-drawer>
 */
export class SoDrawer extends SoOverlay {
  _openClass = 'so-drawer--open';
  _bodyLockClass = 'so-body-locked';
  _panelAttr = 'data-drawer-panel';
  _closeAttr = 'data-drawer-close';
  _triggerAttr = 'trigger-selector';
  _eventPrefix = 'so:drawer';
}
