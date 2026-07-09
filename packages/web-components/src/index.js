import { registerElement } from './register.js';
export { SoElement } from './base-element.js';

// Core utilities
export { emit, qs, qsa, setExpanded, rememberFocus, debounce, throttle, trapFocus, cssVar, once, announce, slotContent } from './helpers.js';

// Overlay base class
export { SoOverlay } from './components/overlay.js';

// ─── Existing components ───────────────────────────────────────────────────
import { SoDisclosure } from './components/disclosure.js';
import { SoAccordion } from './components/accordion.js';
import { SoDrawer } from './components/drawer.js';
import { SoLiveRegion } from './components/live-region.js';
import { SoModal } from './components/modal.js';
import { SoQuantity } from './components/quantity.js';
import { SoTabs } from './components/tabs.js';
import { SoToast } from './components/toast.js';
import { SoVariantController } from './components/variant-controller.js';
import { SoProductForm } from './components/product-form.js';
import { SoMediaGallery } from './components/media-gallery.js';
import { SoStickyBuyBar } from './components/sticky-buy-bar.js';
import { SoStickyHeader } from './components/sticky-header.js';
import { SoLocalization } from './components/localization.js';
import { SoCartDrawer } from './components/cart-drawer.js';
import { SoCartItems } from './components/cart-items.js';
import { SoPredictiveSearch } from './components/predictive-search.js';
import { SoFacets } from './components/facets.js';
import { SoSort } from './components/sort.js';
import { SoQuickAdd } from './components/quick-add.js';
import { SoCarousel } from './components/carousel.js';
import { SoQuickView } from './components/quick-view.js';
import { SoProductCard } from './components/product-card.js';
import { SoSwatches } from './components/swatches.js';
import { SoInfiniteList } from './components/infinite-list.js';
import { SoDeferredMedia } from './components/deferred-media.js';
import { SoRecipientForm } from './components/recipient-form.js';
import { SoPickupAvailability } from './components/pickup-availability.js';
import { SoShare } from './components/share.js';

// ─── New components ────────────────────────────────────────────────────────
import { SoPrice } from './components/price.js';
import { SoRating } from './components/rating.js';
import { SoPagination } from './components/pagination.js';
import { SoBreadcrumb } from './components/breadcrumb.js';
import { SoCountdown } from './components/countdown.js';
import { SoStockIndicator } from './components/stock-indicator.js';
import { SoProgressBar } from './components/progress-bar.js';
import { SoAnnouncementBar } from './components/announcement-bar.js';
import { SoBackToTop } from './components/back-to-top.js';

// ─── Register all ──────────────────────────────────────────────────────────
registerElement('so-disclosure', SoDisclosure);
registerElement('so-quantity', SoQuantity);
registerElement('so-drawer', SoDrawer);
registerElement('so-modal', SoModal);
registerElement('so-accordion', SoAccordion);
registerElement('so-tabs', SoTabs);
registerElement('so-toast', SoToast);
registerElement('so-live-region', SoLiveRegion);
registerElement('so-variant-controller', SoVariantController);
registerElement('so-product-form', SoProductForm);
registerElement('so-media-gallery', SoMediaGallery);
registerElement('so-sticky-buy-bar', SoStickyBuyBar);
registerElement('so-sticky-header', SoStickyHeader);
registerElement('so-localization', SoLocalization);
registerElement('so-cart-drawer', SoCartDrawer);
registerElement('so-cart-items', SoCartItems);
registerElement('so-predictive-search', SoPredictiveSearch);
registerElement('so-facets', SoFacets);
registerElement('so-sort', SoSort);
registerElement('so-quick-add', SoQuickAdd);
registerElement('so-carousel', SoCarousel);
registerElement('so-quick-view', SoQuickView);
registerElement('so-product-card', SoProductCard);
registerElement('so-swatches', SoSwatches);
registerElement('so-infinite-list', SoInfiniteList);
registerElement('so-deferred-media', SoDeferredMedia);
registerElement('so-recipient-form', SoRecipientForm);
registerElement('so-pickup-availability', SoPickupAvailability);
registerElement('so-share', SoShare);

registerElement('so-price', SoPrice);
registerElement('so-rating', SoRating);
registerElement('so-pagination', SoPagination);
registerElement('so-breadcrumb', SoBreadcrumb);
registerElement('so-countdown', SoCountdown);
registerElement('so-stock-indicator', SoStockIndicator);
registerElement('so-progress-bar', SoProgressBar);
registerElement('so-announcement-bar', SoAnnouncementBar);
registerElement('so-back-to-top', SoBackToTop);
