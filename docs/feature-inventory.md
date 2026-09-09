# Feature Inventory

| | |
|---|---|
| Theme (source): | "Veloura" v1.0.0 — rebrand of FoxEcom "Zest" v9.1.1, Dawn-derived core (see docs/source-audit.md) |
| Theme root: | /Users/devhugon/Desktop/Workspaces/miso-apps/theme-base |
| Analyst date: | 2026-09-09 |
| Product spec consulted: | Stage 2 reference-rebuild — fashion/beauty lifestyle brands, mobile commerce. Current codebase is an INELIGIBLE source (THIRD-PARTY FoxEcom Zest + Dawn-derived per docs/source-audit.md); treated as concept reference ONLY. |
| Detector run: | node .agents/skills/theme-feature-analyst/scripts/detect-features.mjs /Users/devhugon/Desktop/Workspaces/miso-apps/theme-base |

> **Orchestrator override (reference-rebuild):** `keep_implementation: false` for EVERY feature — the entire codebase is third-party FoxEcom Zest + Dawn-derived and must not be carried over (per docs/source-audit.md: GPL-3.0 Flickity in vendor.js, GSAP standard license, `foxecom-bs-kit` metafields, Theme Store approved-codebase rule). `keep_concept` follows normal classification. `templates: [all]` means the feature is rendered globally by `layout/theme.liquid` on every storefront template. Mutable Shopify Theme Store requirements cited from https://shopify.dev/docs/storefronts/themes/store/requirements (fetched 2026-09-09).

## Classification legend

- CORE — must keep (load-bearing). keep_concept: true, keep_implementation: true
- VALUABLE — keep concept, rebuild implementation. keep_concept: true, keep_implementation: false
- GENERIC — standard feature, rebuild per new architecture. keep_concept: true, keep_implementation: false
- REDESIGN — concept worth keeping, needs new UX. keep_concept: true, keep_implementation: false
- REMOVE — no value. keep_concept: false, keep_implementation: false
- APP-LIKE — belongs in an app, not a theme. keep_concept: false, keep_implementation: false
- RISKY — licensing/performance/a11y risk. keep_concept: judgment, keep_implementation: false

## Inventory

```yaml
features:
  - id: header
    name: Site Header
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/header.liquid
      - sections/header-group.json
      - snippets/site-logo.liquid
      - snippets/header__addons.liquid
      - snippets/header__search.liquid
      - snippets/cart-link.liquid
      - snippets/user-links.liquid
      - assets/header.css
      - assets/header.js
      - assets/site-nav.css
    settings: [layout, sticky_header, sticky_type, transparent_header, logo, logo_transparent, logo_mobile, logo_on_dropdown_menu, logo_width, logo_mobile_width, main_menu, mobile_menu, menu_dropdown_color_schema, dropdown_menu_trigger, enable_mega_menu, show_search, show_cart, show_account, show_country_selector, show_language_selector, logo_mobile_position, mobile_show_search, mobile_show_cart, mobile_show_account, mobile_show_social]
    templates: [all]
    rationale: >
      Load-bearing site chrome: logo, layout, sticky/transparent header, cart/account/search
      icons and header add-ons (country/language selectors). Rebuilt from scratch on the new
      architecture; per Theme Store requirements the header must also carry the <shopify-account>
      component, which this implementation lacks.

  - id: site_navigation
    name: Multi-level Navigation + Mobile Drawer
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/site-nav.liquid
      - sections/header.liquid
      - assets/site-nav.css
      - assets/mobile-nav.js
      - assets/header.js
    settings: [main_menu, mobile_menu, dropdown_menu_trigger]
    templates: [all]
    rationale: >
      Multi-level dropdown menus and the mobile drawer menu. Multi-level menus are a Theme Store
      requirement (shopify.dev/docs/storefronts/themes/store/requirements); the shipped markup is
      Dawn/FoxEcom-derived and must be rebuilt. Mega-menu addons are inventoried separately.

  - id: footer
    name: Footer
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/footer.liquid
      - sections/footer-group.json
      - snippets/social-links.liquid
      - snippets/newsletter-form.liquid
      - snippets/country-selector.liquid
      - snippets/language-selector.liquid
      - assets/footer.css
    settings: [show_copyright, show_divider, enable_follow_on_shop, show_social, icon_size, enable_country_selector, enable_language_selector, show_payments, bottom_menu]
    templates: [all]
    rationale: >
      Load-bearing footer with link lists, newsletter, social links, country/language selectors,
      payment icons and Follow on Shop. Follow on Shop and country/language selection are Theme
      Store requirements; rebuild on the new architecture.

  - id: main_product
    name: Main Product Section (blocks)
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-product.liquid
      - snippets/main-product-blocks.liquid
      - templates/product.json
      - templates/product.stacked.json
      - templates/product.thumbnails-carousel.json
      - templates/product.grid-mix.json
    settings: [show_breadcrumb, enable_sticky_info, media_layout, media_size, mobile_thumbnails, enable_image_zoom, enable_video_looping, show_featured_media]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      The PDP block system (title, price, variant picker, quantity, buy buttons, meta, description,
      collapsible tabs, etc.). Theme Store requires product page elements as individual blocks with
      @app block support; 886/1674 lines overlap Dawn v15.2 per source-audit and must be rewritten.

  - id: product_media_gallery
    name: Product Media Gallery
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-media.liquid
      - snippets/product-thumbnail.liquid
      - assets/product-media.js
      - assets/product-model.js
      - assets/product.css
      - assets/flickity-component.css
      - assets/photoswipe-component.css
    settings: [media_layout, media_size, mobile_thumbnails, enable_image_zoom, enable_video_looping, show_featured_media]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Media gallery with carousel/grid layouts, thumbnails, video looping, 3D model + XR button and
      PhotoSwipe zoom/lightbox. Rich product media is a Theme Store requirement; the carousel/lightbox
      engine is the RISKY vendor.js bundle (see vendor_bundle) so the concept stays but the
      implementation must be rebuilt on a properly licensed slider.

  - id: variant_picker
    name: Variant Picker
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/variant-picker.liquid
      - snippets/product-variant-options.liquid
      - snippets/swatch-input.liquid
      - assets/variants-picker.js
    settings: [vp_swatch_type, qv_picker_type, qv_variant_picker_show_selected]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Option selection via dropdown, buttons, or swatches using the Shopify swatch object
      (swatch.image / swatch.color), which Theme Store requirements mandate. Split options,
      sold-out disabling and browser-history sync must be preserved; markup is Dawn-derived.

  - id: buy_buttons
    name: Buy Box (Add to Cart, Dynamic Checkout, Quantity)
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
      - assets/product-form.js
      - snippets/gift-card-recipient-form.liquid
      - assets/recipient-form.js
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Add-to-cart form, quantity selector with quantity rules, dynamic checkout / payment button and
      gift-card recipient fields. Accelerated checkout buttons, Shop Pay Installments and quantity
      selection are Theme Store requirements; rebuild on native product-form.

  - id: pickup_availability
    name: Pickup Availability
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/pickup-availability.liquid
      - assets/pickup-availability.js
      - assets/pickup-availability.css
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Local-pickup availability display on the product page via store_availabilities; a Theme Store
      requirement. Standard Dawn behavior; rebuild per new architecture.

  - id: product_recommendations
    name: Related Product Recommendations
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/product-recommendations.liquid
    settings: [remove_params, limit, columns, enable_slider, show_nav, show_dots, enable_swipe_mobile]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix, cart]
    rationale: >
      Automatically generated related products via the recommendations endpoint; a Theme Store
      requirement on product pages. Slider is flickity-based (see vendor_bundle); rebuild clean.

  - id: complementary_products
    name: Complementary Products Block
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
    settings: [product_list_limit, products_per_page, enable_slider, enable_quick_add, enable_quick_view, make_collapsible_row]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Complementary-products recommendations (intent=complementary) are a Theme Store requirement and
      drive attach-rate in beauty/fashion. Current block is coupled to flickity + product-card and
      must be rebuilt as a native product-recommendations variant.

  - id: cart_page
    name: Cart Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-cart-items.liquid
      - sections/main-cart-footer.liquid
      - sections/cart-live-region-text.liquid
      - snippets/cart-block-discount.liquid
      - snippets/cart-block-note.liquid
      - snippets/cart-block-shipping.liquid
      - assets/cart.js
      - assets/quantity-popover.js
      - assets/quantity-popover.css
      - assets/cart.css
    settings: [show_vendor]
    templates: [cart]
    rationale: >
      Cart template with line items, quantity popover, discount/note/shipping blocks, subtotal and
      dynamic checkout buttons. Theme Store requires discounts, accelerated checkout, selling plans
      and unit pricing on the cart page; rebuild per new architecture (Dawn-derived).

  - id: cart_drawer
    name: Cart Drawer
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/cart-drawer.liquid
      - sections/cart-drawer.liquid
      - snippets/cart-drawer-item.liquid
      - assets/cart-drawer.js
      - assets/cart-drawer.css
      - assets/cart-goal.js
      - snippets/cart-block-note.liquid
      - snippets/cart-block-discount.liquid
      - snippets/cart-block-shipping.liquid
    settings: [cart_type, cart_icon, show_cart_drawer_when_added, cart_drawer_show_cart_count, cart_drawer_show_view_cart, enable_drawer_cart_discount, enable_drawer_cart_note, enable_drawer_shipping_rates, cart_default_country]
    templates: [all]
    rationale: >
      Slide-out cart with line items, note/discount/shipping blocks and empty-cart collection links.
      The persistent drawer is the core mobile checkout-friction remover for fashion/beauty; the
      shipped implementation is heavy and laced with FoxKit app hooks (see foxkit_app_embeds) —
      rebuild on the new cart component.

  - id: free_shipping_progress
    name: Free Shipping Progress Bar
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/cart-goal.liquid
      - assets/cart-goal.js
      - assets/cart-goal.css
    settings: [show_free_shipping_message, free_shipping_message, free_shipping_limit]
    templates: [all]
    rationale: >
      Free-shipping threshold progress bar in the drawer and cart — a proven AOV/conversion driver
      for mobile fashion stores. Rebuild as a lightweight component; confetti is split out (REMOVE).

  - id: cart_recommendations
    name: Cart Page Recommendations
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/cart-recommendations.liquid
      - assets/cart-recommendations.js
    settings: [cart_recommendations_enable]
    templates: [cart]
    rationale: >
      Product recommendations surfaced at cart time for last-minute upsell; merchant-placeable section
      enabled globally by cart_recommendations_enable. Concept converts; implementation is Dawn-derived
      and flickity-coupled.

  - id: quick_add
    name: Quick Add to Cart
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-card.liquid
      - assets/product-form.js
      - snippets/main-product-blocks.liquid
    settings: [pcard_show_cart_button, pcard_choose_options_actions, pcard_mobile_hide_quick_add]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search, index, page.lookbook]
    rationale: >
      One-tap add-to-cart from product cards (with choose-options fallback to quick view). Removes
      browse-to-buy friction; enabled by default (pcard_show_cart_button). Implementation is coupled
      to the legacy product-card markup and must be rebuilt on the new card component.

  - id: quick_view
    name: Quick View Modal
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/product-quickview.liquid
      - assets/quick-view.js
      - assets/modal-component.css
      - snippets/product-card.liquid
    settings: [pcard_show_quickview_button, qv_show_quantity_selector, qv_show_dynamic_checkout_button, qv_show_vendor, qv_show_custom_tag, qv_show_featured_media, qv_show_sale_badge, qv_sale_badge_type, qv_show_soldout_badge, qv_picker_type, qv_variant_picker_show_selected]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search, index, page.lookbook]
    rationale: >
      Fetches the product-quickview section via the sections API into a modal for fast inspection and
      add-to-cart without leaving the grid. Real conversion driver on mobile; rebuild as a modern
      slide-over/modal on the new card and product-form components.

  - id: predictive_search
    name: Predictive Search + Search Drawer
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/search-drawer.liquid
      - sections/predictive-search.liquid
      - sections/main-search.liquid
      - assets/search-drawer.js
      - assets/main-search.js
      - assets/search-drawer.css
      - assets/search.css
    settings: [predictive_search_enabled, predictive_search_show_price, predictive_search_show_vendor, predictive_search_most_searched_keywords, predictive_search_collection]
    templates: [all]
    rationale: >
      Global search drawer with typeahead results (products, price/vendor), popular keywords and a
      recommended collection. Predictive search is a Theme Store requirement; the keyword/recommended
      rails are strong merchandising for fashion. Rebuild on the new search architecture.

  - id: sticky_atc_bar
    name: Sticky Add-to-Cart Bar
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/sticky-atc-bar.liquid
      - assets/sticky-atc-bar.js
      - assets/sticky-atc-bar.css
    settings: [show_on_desktop, show_on_mobile, show_atc_button, show_dynamic_checkout_buttons, show_quantity]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Persistent bottom bar on the product page (rendered by layout for template.name == 'product')
      with ATC/dynamic checkout/quantity. Key mobile conversion feature for long fashion PDPs; the
      implementation fights the native sticky info column and must be rebuilt.

  - id: recently_viewed
    name: Recently Viewed Products
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/product-recently-viewed.liquid
      - assets/recently-viewed-products.js
    settings: [columns, enable_slider, show_nav, show_dots, enable_swipe_mobile]
    templates: []
    rationale: >
      localStorage-backed recently-viewed rail (merchant-addable preset section). Strong retention tool
      for mobile fashion browsing; storefront-local state is theme-appropriate. Rebuild per new card.

  - id: variant_group_images
    name: Variant Group Images (media swap)
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-media.liquid
      - sections/main-product.liquid
      - sections/featured-product.liquid
      - sections/product-quickview.liquid
      - assets/product-media.js
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Swaps the media gallery to variant-grouped images when a variant is selected — the visual core
      of fashion/beauty PDPs. Theme Store requires variant images to show on variant select. Reads the
      vendor metafield namespace foxecom-bs-kit['variant-images'] (source-audit fingerprint); rebuild
      on an own metafield or native variant media.

  - id: products_bundle
    name: Products Bundle Builder
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/products-bundle.liquid
      - assets/products-bundle.js
      - assets/products-bundle.css
      - assets/ProductsBundle.js
      - assets/product-bundle.js
    settings: [image_position, desktop_content_position, subheading, heading, desktop_content_alignment, mobile_content_alignment]
    templates: [index]
    rationale: >
      Bundle-of-products section with per-product selectors and combined price into one add-to-cart —
      directly supports beauty kits and fashion sets. Bespoke FoxEcom JS (ProductsBundle.js) with no
      app boundary; rebuild on native product forms and cart properties.

  - id: lookbook
    name: Shoppable Lookbook
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/lookbook.liquid
      - snippets/lookbook-card.liquid
      - assets/component-lookbook-card.css
      - assets/lookbook-icon.js
      - snippets/custom-card.liquid
    settings: [image_aspect_ratio, columns, column_gap]
    templates: [page.lookbook, index]
    rationale: >
      Editorial image with hotspot pins revealing products (lookbook block inside custom-content too).
      The shoppable lookbook is the signature fashion/beauty merchandising concept; hotspot
      implementation is FoxEcom-specific and must be rebuilt with accessible, touch-friendly pins.

  - id: popup
    name: Marketing Popup (email capture)
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/popup.liquid
      - assets/popup-component.js
      - assets/popup-component.css
    settings: [design_mode, enable, show_for_homepage_only, show_for_visitors_only, trigger_open, repeat_open, alignment, width, show_teaser, teaser_button_text, teaser_popup_bg, teaser_popup_text]
    templates: []
    rationale: >
      Timed/teaser email-capture popup posting to the native {% form 'customer' %} newsletter endpoint
      (theme-appropriate). Useful for beauty email acquisition; not shipped in any template (merchant
      adds it). Rebuild with modern trigger controls and focus management.

  - id: scroll_animations
    name: Scroll-in Animations
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - assets/animations.js
      - sections/hero.liquid
      - sections/image-with-text.liquid
    settings: [animations, animation_duration, image_hover_effect]
    templates: [all]
    rationale: >
      Reveal-on-scroll motion system with prefers-reduced-motion guard (fade-in-up enabled by default).
      Subtle motion is on-brand for a premium fashion/beauty feel; keep the concept but rebuild lean on
      IntersectionObserver to protect the Lighthouse 60 performance requirement.

  - id: gift_wrapping
    name: Gift Wrapping Add-on
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/cart-gift-wrapping.liquid
      - snippets/cart-drawer.liquid
      - snippets/cart-drawer-item.liquid
      - assets/gift-wrapping.js
      - assets/component-gift-wrapping.css
    settings: []
    templates: [cart]
    rationale: >
      Optional gift-wrap line item driven by a gift-wrapping linklist + cart attribute, shown in drawer
      and cart. Gift options fit fashion/beauty gifting; implementation is tied to a linklist
      convention and vendor JS and must be rebuilt on cart attributes.

  - id: mobile_sticky_bar
    name: Mobile Sticky Bottom Bar
    class: VALUABLE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/mobile-sticky-bar.liquid
    settings: [enable_sticky_bar, show_text]
    templates: []
    rationale: >
      Fixed mobile bottom nav (home/cart/search/products/custom links). Natural fit for thumb-reach
      mobile commerce, but no shipped template renders it and it has no preset — merchant-addable.
      Rebuild as a proper mobile nav pattern if the new architecture wants it.

  - id: announcement_bar
    name: Announcement Bar
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/announcement-bar.liquid
    settings: [color_schema, show_close_button, enable_carousel, autoplay, autorotate_speed]
    templates: [all]
    rationale: >
      Rotating announcement messages with autoplay and close button — standard promo strip. No
      bespoke value; rebuild per new architecture.

  - id: money_currency_format
    name: Currency Code Display
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/theme-script.liquid
      - snippets/cart-drawer.liquid
    settings: [currency_code_enabled]
    templates: [all]
    rationale: >
      Switches money rendering between shop.money_format and money_with_currency_format globally.
      Standard localization behavior; fold into the new money/localization handling.

  - id: rtl_support
    name: RTL Support
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - layout/theme.liquid
      - layout/password.liquid
      - assets/rtl.css
    settings: [enable_rtl, language_support_rtl]
    templates: [all]
    rationale: >
      Per-language dir="rtl" on <html> plus rtl.css overrides. Standard i18n feature; rebuild CSS
      overrides against the new design system.

  - id: scroll_to_top
    name: Scroll to Top Button
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/scroll-top-button.liquid
      - snippets/theme-script.liquid
    settings: [show_scroll_top_button]
    templates: [all]
    rationale: >
      Floating back-to-top button shown after scrolling (rendered from layout when enabled). Standard
      utility; rebuild per new architecture.

  - id: cookie_banner
    name: Cookie Consent Banner
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/cookie-banner.liquid
      - assets/cookie-consent.css
    settings: [cb_design_mode, show_cookie_banner, cookie_message, cookie_color_schema]
    templates: [all]
    rationale: >
      GDPR/CCPA consent banner using Shopify's consent-tracking-api (native endpoint — theme
      appropriate). Standard compliance feature; rebuild with the current consent API.

  - id: newsletter
    name: Newsletter Signup
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/newsletter.liquid
      - snippets/newsletter-form.liquid
    settings: [heading, subheading, description, email_placeholder, hide_label, form_position, text_alignment, image]
    templates: [index]
    rationale: >
      Newsletter form posting to the native customer endpoint (Theme Store requirement: newsletter
      forms). Standard; rebuild per new architecture.

  - id: contact_form
    name: Contact Form
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/contact-form.liquid
    settings: [form_design, form_width, form_alignment, button_label, button_style]
    templates: [page.contact]
    rationale: >
      Contact form posting to the native contact endpoint. Required page.contact template support;
      standard rebuild.

  - id: faq_accordion
    name: FAQ / Collapsible Tabs
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/collapsible-tabs.liquid
      - snippets/collapsible-item.liquid
      - assets/collapsible-tab.js
      - assets/collapsible-tabs.css
    settings: [heading, subheading, description, column_gap, content_width]
    templates: [page.faqs, page.about-us]
    rationale: >
      Accordion content organizer (used on FAQ page). Standard pattern; rebuild on the new
      collapsible component.

  - id: tabs_content
    name: Tabbed Content Sections
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/collage-tabs.liquid
      - sections/collection-tabs.liquid
      - sections/product-tabs.liquid
      - assets/collage-tabs.css
      - assets/collection-tabs.js
      - assets/collection-tabs.css
      - assets/tabs-component.js
      - assets/tabs-component.css
      - snippets/collection-tab.liquid
    settings: [desktop_navigation_alignment, desktop_image_position, desktop_image_width, image_aspect_ratio, trigger_behavior, autoplay, autoplay_duration]
    templates: [page.contact, index]
    rationale: >
      Tab-switched content (image collage tabs, collection tabs, product-card tabs). Standard content
      organizer; rebuild on an accessible tabs component.

  - id: product_information_tabs
    name: Product Information Tabs
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/product-information-tabs.liquid
    settings: []
    templates: []
    rationale: >
      Merchant-addable PDP tabs (description / custom content / custom liquid). Useful for beauty
      (ingredients, how-to, shipping). Rebuild per new architecture; its reviews block is inventoried
      separately as APP-LIKE.

  - id: image_comparison
    name: Image Comparison (before/after)
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/image-comparison.liquid
      - assets/image-comparison-slider.css
    settings: [layout, image_height]
    templates: []
    rationale: >
      Drag before/after slider (merchant-addable; also a custom-content block). Relevant for beauty
      results content; standard interaction, rebuild with touch/keyboard support.

  - id: marquee
    name: Scrolling Marquee
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/scrolling-promotion.liquid
      - assets/scrolling-promotion.css
    settings: [alignment, direction, pause_on_hover, speed, item_gap, item_gap_mobile]
    templates: [index, product, product.stacked, product.thumbnails-carousel, product.grid-mix, page.about-us, page.about-us-2]
    rationale: >
      Infinite scrolling text/image/announcement strip with speed and direction controls. A standard
      promo marquee for fashion brands; rebuild with reduced-motion handling.

  - id: social_links
    name: Social Media Links
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/social-links.liquid
      - sections/footer.liquid
    settings: [social_twitter_link, social_facebook_link, social_pinterest_link, social_instagram_link, social_tiktok_link, social_tumblr_link, social_snapchat_link, social_youtube_link, social_vimeo_link, social_linkedin_link, social_spotify_link, social_whatsapp_link]
    templates: [all]
    rationale: >
      Footer/header social icon links (Instagram, TikTok, etc. — core for fashion/beauty). Standard
      feature; rebuild icon set per new design system.

  - id: social_sharing
    name: Product Social Sharing
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/social-sharing.liquid
      - snippets/main-product-blocks.liquid
      - assets/share-button.js
    settings: [share_facebook, share_twitter, share_pinterest]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Share modal with copy-link and Facebook/Twitter/Pinterest buttons on the PDP. Standard feature;
      rebuild on native share/copy APIs.

  - id: social_proof
    name: Social Proof Sections (press, testimonials, logo list)
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/press.liquid
      - sections/testimonials.liquid
      - sections/logo-list.liquid
      - assets/press.css
      - assets/testimonial.css
    settings: [show_nav, autoplay, autorotate_speed, design, stars_color, card_color_schema, columns]
    templates: [page.about-us, index]
    rationale: >
      Press-mention carousel, customer testimonial cards and partner logo strips. Standard
      trust-building sections for lifestyle brands; rebuild per new architecture.

  - id: featured_blog
    name: Featured Blog Section
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/featured-blog.liquid
      - snippets/article-card.liquid
    settings: [blog, image_aspect_ratio, article_heading_size, show_date, show_excerpt, show_readmore, limit, columns, enable_slider, show_dots, show_nav, enable_swipe_mobile]
    templates: [index]
    rationale: >
      Blog-post cards on the homepage (editorial content is strong for fashion). Standard section;
      rebuild on the new article card.

  - id: merchandising_sections
    name: Product/Collection Merchandising Sections
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/featured-collection.liquid
      - sections/collection-list.liquid
      - sections/collection-list-slider.liquid
      - sections/handpicked-products.liquid
      - sections/featured-product.liquid
      - sections/featured-product-slider.liquid
      - sections/favorite-collection.liquid
      - sections/favorite-products.liquid
      - sections/product-card-grid.liquid
      - sections/collections-showcase.liquid
      - assets/collection-list-slider.css
      - assets/featured-product-slider.css
      - assets/favorite-collection.css
      - assets/favorite-products.css
      - assets/collections-showcase.js
      - snippets/collection-card.liquid
    settings: [collection, product_list, limit, columns, enable_slider, show_nav, show_dots, enable_swipe_mobile, pcard_image_ratio, show_vendor, card_style]
    templates: [index, page.lookbook]
    rationale: >
      Standard merchandising grid/slider sections (featured collection, collection list, handpicked
      products, featured product, favorites). All rebuild as standard product-grid sections on the new
      card component; sliders drop the flickity dependency.

  - id: hero_sections
    name: Hero / Video Hero / Banner Logo
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/hero.liquid
      - sections/video-hero.liquid
      - sections/banner-logo.liquid
      - assets/hero.css
      - assets/banner-logo.css
      - assets/banner-logo.js
    settings: [image, image_mobile, image_overlay_opacity, hero_height, content_position, text_alignment, text_color, video_type, shopify_video, video_url, enable_bg_zoom_effect]
    templates: [index, page.lookbook, page.about-us-2, product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Full-bleed hero family with background image/video, mobile image swap, overlay and zoom effect.
      Standard homepage hero; rebuild per new art direction (keep editorial strength).

  - id: slideshows
    name: Slideshow / Image-with-Text Slider
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/slideshow.liquid
      - sections/image-with-text-slider.liquid
      - assets/slideshow-component.js
      - assets/slideshow-component.css
      - assets/image-with-text-slider.js
      - assets/image-with-text-slider.css
    settings: [slideshow_height, show_dots, show_nav, autoplay, autorotate_speed, pagination_style, slider_height, image_width, image_position]
    templates: [index]
    rationale: >
      Carousel slideshow with slide/video blocks and autoplay. Standard marketing section; rebuild on
      a lightweight slider without the flickity bundle.

  - id: content_sections
    name: Editorial Content Sections
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/image-with-text.liquid
      - sections/multicolumn.liquid
      - sections/rich-text.liquid
      - sections/custom-content.liquid
      - sections/custom-html.liquid
      - sections/gallery-images.liquid
      - sections/uneven-image-cards.liquid
      - sections/highlight-text-with-image.liquid
      - sections/promotion-banner.liquid
      - sections/video.liquid
      - assets/image-with-text.css
      - assets/multicolumn.css
      - assets/gallery-images.css
      - assets/uneven-image-cards.css
      - assets/highlight-text-image.js
      - assets/highlight-text-image.css
      - assets/promotion-banner.css
      - snippets/custom-card.liquid
    settings: [image, image_width, image_position, heading, subheading, description, columns, column_gap, row_gap, enable_swipe_mobile, video_type, shopify_video, video_url, autoplay_video]
    templates: [index, page.about-us, page.about-us-2, page.find-a-store, page.lookbook, page.contact, product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      The standard editorial kit: image-with-text, multicolumn, rich text, custom-content block
      library (text/image/video/product/article/html/liquid/image-card), gallery, uneven cards,
      highlight text, promo banner and video. All rebuild as standard content sections; the
      custom-content block library is the merchant workhorse and should be carried as concept.

  - id: product_meta
    name: Product Meta Block
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      PDP block listing availability, SKU, vendor, type, collections and tags. Standard product
      information; rebuild per new architecture.

  - id: inventory_status
    name: Inventory Status Block
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
      - snippets/product-inventory.liquid
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      In/out-of-stock messaging block with quantity-rule awareness. Standard scarcity signal for
      fashion; rebuild on native inventory objects.

  - id: trust_badges
    name: Trust Badge Block
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Merchant image + headline trust strip (shipping/returns/payment icons) on the PDP. Standard
      trust signal; rebuild as a content block.

  - id: product_rating
    name: Product Rating Display
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-rating.liquid
      - snippets/main-product-blocks.liquid
      - snippets/product-card.liquid
    settings: [pcard_show_review_badge]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix, collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search]
    rationale: >
      Star rating from the native reviews metafield (product.metafields.reviews.rating.value) on PDP
      and cards. Theme-appropriate (Shopify metafield data); rebuild per new design.

  - id: volume_pricing
    name: Volume Pricing / Quantity Breaks
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/main-product-blocks.liquid
      - assets/volume-pricing.js
      - assets/volume-pricing.css
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Quantity-price-break table and note on the PDP when product.quantity_price_breaks_configured?
      Relevant for beauty bundles; standard rebuild on native quantity price breaks.

  - id: shipping_rate_calculator
    name: Shipping Rate Calculator
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/cart-block-shipping.liquid
      - snippets/cart-drawer.liquid
      - sections/main-cart-footer.liquid
      - assets/footer-calc-shipping-rates.js
    settings: [enable_drawer_shipping_rates, cart_default_country]
    templates: [cart]
    rationale: >
      Estimates shipping via the native /cart/shipping_rates.json endpoint in drawer and cart. Posts
      to a native Shopify endpoint (theme-appropriate); rebuild per new architecture.

  - id: ask_question_form
    name: Ask a Question Form
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/ask-question-form.liquid
      - snippets/main-product-blocks.liquid
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Product pre-purchase Q&A modal posting to the native contact endpoint — reduces fit/color
      uncertainty and returns in fashion. Standard contact-form variant; rebuild.

  - id: notifications
    name: Toast Notifications
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - assets/notification.js
      - snippets/notify.liquid
    settings: []
    templates: [all]
    rationale: >
      Global toast/snackbar (add-to-cart success, errors) used across cart, product form and goals.
      Standard feedback layer; rebuild. Note: snippets/notify.liquid renders an empty container and is
      dead markup; the behavior lives in notification.js.

  - id: collection_banner
    name: Collection Banner
    class: GENERIC
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-collection-banner.liquid
      - assets/main-collection-banner.css
    settings: [text_alignment, heading_size, show_breadcrumb, show_desc, show_collection_image, image_height, image_position, image_overlay_opacity]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image]
    rationale: >
      Collection title/description/image banner above the grid. Standard collection-page header;
      rebuild per new art direction.

  - id: collection_page
    name: Collection Product Grid
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-collection-product-grid.liquid
      - snippets/product-grid-header.liquid
      - snippets/collection-sortby.liquid
      - snippets/pagination.liquid
      - assets/collection.css
      - assets/product-grid-container.js
    settings: [products_per_page, columns, column_gap, row_gap, enable_product_count, paginate_type]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image]
    rationale: >
      The collection grid with pagination, product count and sort (sorting/filtering surfaced via the
      facets drawer). Load-bearing browse surface for fashion; rebuild on the new card + grid system.

  - id: faceted_filtering
    name: Faceted Search Filtering
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/facets.liquid
      - snippets/facets-nojs.liquid
      - snippets/facet-swatch.liquid
      - assets/facets.js
      - assets/filter-color-swatch.js
      - assets/drawer-component.css
    settings: [enable_filtering, enable_sorting, sidebar_position, group_collapsible, default_state_collapsible, open_first_group, filter_group_heading_size, show_results_count, filter_color_type, paginate_type]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search]
    rationale: >
      Filter/sort by availability, price, vendor, type and variant options, with native swatch filters
      — a Theme Store requirement on collection and search pages. Rebuild on native filter objects.

  - id: search_page
    name: Search Results Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-search.liquid
      - assets/main-search.js
      - assets/search.css
    settings: [limit, columns, enable_product_count, enable_filtering, enable_sorting, sidebar_position, group_collapsible, open_first_group, show_results_count, filter_color_type]
    templates: [search]
    rationale: >
      Search results template with product grid and faceted filtering/sorting (search template support
      and faceted filtering are Theme Store requirements). Rebuild on the shared grid/facets system.

  - id: blog_page
    name: Blog Listing
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-blog.liquid
      - snippets/article-card.liquid
      - snippets/article-card-placeholder.liquid
      - assets/blog.css
    settings: [show_title, posts_to_show, posts_per_row, article_image_aspect_ratio, article_heading_size, show_date, show_excerpt, show_readmore]
    templates: [blog]
    rationale: >
      Blog index with article cards, date/excerpt/read-more and pagination. Required template; rebuild
      standard.

  - id: article_page
    name: Article Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-article.liquid
      - snippets/comment.liquid
    settings: []
    templates: [article]
    rationale: >
      Article layout with rich text, sharing and comments. Required template; rebuild standard.

  - id: page_section
    name: Page Section
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-page.liquid
    settings: []
    templates: [page, page.about-us, page.about-us-2, page.contact, page.faqs, page.find-a-store, page.lookbook]
    rationale: >
      Static page renderer. Required template support; trivial rebuild.

  - id: list_collections_page
    name: List Collections Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-list-collections.liquid
      - snippets/collection-card.liquid
    settings: [collections_to_show, collections_per_row, collections_per_page, sort, card_style, text_alignment, text_color, image_ratio, show_count]
    templates: [list-collections]
    rationale: >
      Collection directory page. Required template; rebuild on the collection card component.

  - id: page_404
    name: 404 Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-404.liquid
    settings: []
    templates: [404]
    rationale: >
      Not-found page with search/collection escape hatches. Required template; rebuild standard.

  - id: password_page
    name: Password / Coming Soon Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/main-password.liquid
      - layout/password.liquid
      - assets/password.js
      - assets/password.css
    settings: [background_color, background_image, text_color, show_overlay, full_screen]
    templates: [password]
    rationale: >
      Storefront password gate with newsletter/social blocks. Required template; rebuild standard.

  - id: gift_card_page
    name: Gift Card Page
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - templates/gift_card.liquid
      - assets/giftcard.css
    settings: []
    templates: [gift_card]
    rationale: >
      Gift card redemption display with code copy and recipient info. Gift card template is a Theme
      Store requirement; rebuild standard.

  - id: customer_accounts
    name: Customer Account Pages
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - templates/customers/account.liquid
      - templates/customers/addresses.liquid
      - templates/customers/login.liquid
      - templates/customers/order.liquid
      - templates/customers/register.liquid
      - templates/customers/activate_account.liquid
      - templates/customers/reset_password.liquid
      - assets/customer.js
      - assets/customer.css
    settings: []
    templates: [customers/account, customers/addresses, customers/login, customers/order, customers/register, customers/activate_account, customers/reset_password]
    rationale: >
      Login/register/account/addresses/order flows posting to native customer endpoints. Load-bearing
      account infrastructure; rebuild standard (Dawn-derived per source-audit).

  - id: custom_liquid_section
    name: Custom Liquid Section
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/custom-liquid.liquid
      - snippets/liquid-block.liquid
    settings: [custom_liquid]
    templates: [all]
    rationale: >
      Liquid code section with a liquid-type setting — explicitly required by Theme Store requirements
      as an app insertion point on every section-enabled template. Rebuild verbatim pattern.

  - id: apps_section
    name: App Blocks Section
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - sections/apps.liquid
    settings: [container, color_schema, heading, description]
    templates: []
    rationale: >
      Section wrapper for @app blocks. Theme Store requires app block support (main product and
      featured product sections also carry @app blocks); rebuild the wrapper.

  - id: product_card
    name: Product Card
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-card.liquid
      - snippets/product-card-placeholder.liquid
      - assets/components.css
    settings: [pcard_image_ratio, show_video_instead, pcard_show_second_img, pcard_show_color_swatch, pcard_show_vendor, pcard_show_review_badge, pcard_show_cart_button, pcard_show_quickview_button, pcard_show_badge_soldout, pcard_show_sale_badge, pcard_content_alignment, pcard_sale_badge_type, pcard_choose_options_actions, pcard_mobile_hide_quick_add, pcard_mobile_hide_quick_view]
    templates: [collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search, index, page.lookbook]
    rationale: >
      The product card (image ratio, hover second image, video, sale/soldout/custom-tag badges,
      vendor, review badge, quick actions). It is the load-bearing unit of every browse surface; the
      shipped markup is FoxEcom/Dawn-derived and must be rebuilt as the new card component. Quick
      add/quick view/swatches are inventoried separately.

  - id: design_system
    name: Design System (colors, typography, layout, theme editor)
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - config/settings_schema.json
      - snippets/critical-css.liquid
      - snippets/font-face.liquid
      - assets/theme.css
      - assets/base.css
      - assets/grid.css
      - assets/components.css
      - assets/non-critical.css
      - assets/theme-editor.js
    settings: [color_schemes, color_header_text_transparent, color_badge_sale, color_badge_hot, color_badge_new, color_badge_soldout, color_cart_bubble, color_overlay_bg, color_overlay_alpha, type_body_font, body_font_weight_bolder, body_scale, type_header_font, heading_scale, heading_mobile_scale, heading_letter_spacing, heading_uppercase, highlight_text_font, highlight_text_custom_font, mega_title_font, mega_title_custom_font, mega_title_scale, upper_mega_title, subheading_scale, subheading_font, subheading_font_weight, subheading_letter_spacing, subheading_transform, pcard_title_scale, pcard_title_font, pcard_title_font_weight, pcard_upper_title, menu_font, menu_font_weight, upper_navigation, btn_font, btn_font_weight, btn_height, btn_rounded, upper_btn_label, container_width, section_header_alignment, section_header_alignment_mobile]
    templates: [all]
    rationale: >
      Global color schemes, badge colors, typography scale system (body/heading/mega-title/subheading/
      card-title/menu/button), container width and theme-editor organization. Infrastructure every
      theme needs; the schema is Dawn t:settings_schema-derived and must be rebuilt against the new
      design tokens and merchant-first editor grouping (a Theme Store design/UX requirement).

  - id: seo_meta
    name: SEO / Meta Tags / Favicon
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/meta-tags.liquid
      - layout/theme.liquid
      - layout/password.liquid
    settings: [favicon]
    templates: [all]
    rationale: >
      Canonical URLs, page_description, social share image (page_image) and favicon. Social share
      images are a Theme Store requirement; rebuild standard.

  - id: asset_delivery
    name: Asset Delivery (critical CSS, preload, lazy images)
    class: CORE
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/critical-css.liquid
      - snippets/preload.liquid
      - snippets/font-face.liquid
      - assets/lazy-image.js
      - layout/theme.liquid
    settings: []
    templates: [all]
    rationale: >
      Inline critical CSS, async stylesheet loading, font preloads and lazy-image component. This
      delivery strategy directly protects the Theme Store Lighthouse 60 performance requirement; keep
      the strategy, rebuild against the new asset pipeline.

  - id: mega_menu
    name: Mega Menu
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - sections/header.liquid
      - snippets/site-nav.liquid
      - snippets/custom-card.liquid
    settings: [enable_mega_menu, dropdown_menu_trigger, menu_dropdown_color_schema]
    templates: [all]
    rationale: >
      Dropdown mega menu with product/collection/custom-image addon columns for 3-level menus. The
      concept (rich desktop discovery for fashion catalogs) is real, but hover-triggered opening with
      keyboard focus traps needs a redesigned accessible interaction (keyboard + dismissal + mobile);
      mark REDESIGN per classification guide.

  - id: swatches
    name: Color / Product Swatches
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/product-variant-options.liquid
      - snippets/swatch-input.liquid
      - snippets/product-card-swatch.liquid
      - snippets/facet-swatch.liquid
      - assets/color-swatch.js
      - assets/filter-color-swatch.js
      - assets/product.css
    settings: [color_swatches_enable, color_swatches_trigger, color_swatches_shape, custom_colors, vp_swatch_type, pcard_swatch_type, pcard_show_color_swatch, filter_color_type]
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix, collection, collection.banner-as-background, collection.banner-left, collection.banner-right, collection.banner-top, collection.without-image, search]
    rationale: >
      Swatch rendering on variant pickers, product cards and filter facets (native swatch object,
      custom color config, variant-image swatches). Color selection is the #1 purchase decision for
      fashion/beauty — Theme Store requires swatch support — but the shipped tippy-tooltip hover UX and
      custom color config need a mobile-first redesign (larger targets, clear selected/sold-out states).

  - id: size_chart
    name: Size Chart
    class: REDESIGN
    keep_concept: true
    keep_implementation: false
    files:
      - snippets/variant-picker.liquid
      - snippets/main-product-blocks.liquid
      - snippets/icon-size-chart.liquid
      - sections/product-quickview.liquid
      - assets/modal-component.css
    settings: []
    templates: [product, product.stacked, product.thumbnails-carousel, product.grid-mix]
    rationale: >
      Size chart modal fed by product.metafields.veloura.size_chart or a merchant page. Size guidance
      is critical for fashion (fit = returns), but the scaled-image-in-modal interaction needs a real
      responsive table layout; mark REDESIGN per classification guide. Note the veloura metafield
      namespace must be replaced.

  - id: countdown_timer
    name: Countdown Timer
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/countdown-timer.liquid
      - snippets/countdown-timer.liquid
      - assets/countdown-timer.js
      - assets/countdown-timer.css
      - assets/component-countdown-timer.css
      - snippets/main-product-blocks.liquid
      - sections/custom-content.liquid
    settings: [use_content_container, position, text_alignment, image, show_bg_video, video_type, shopify_video, video_url]
    templates: []
    rationale: >
      Urgency countdown (deadline/evergreen; product block reads metafields.veloura.countdown). A
      gimmick per the classification guide's REMOVE examples and out of place in a premium
      fashion/beauty brand; no shipped template renders the section.

  - id: confetti_effect
    name: Confetti Effect
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - assets/confetti.js
      - snippets/cart-goal.liquid
    settings: [enable_confetti_effect]
    templates: [all]
    rationale: >
      Canvas confetti burst when the free-shipping goal is met. Decoration gimmick (REMOVE per
      classification guide) that adds bundle weight and motion on an already animated milestone; the
      free-shipping goal itself is kept separately.

  - id: page_transition
    name: Page Transition Spinner
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - layout/theme.liquid
      - snippets/theme-script.liquid
    settings: [page_transition]
    templates: [all]
    rationale: >
      Full-page fade/spinner overlay on navigation (enabled by default). A decorative gimmick that
      delays perceived load and fights the Lighthouse performance requirement; drop it.

  - id: age_verifier
    name: Age Verifier Popup
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/age-verifier-popup.liquid
      - assets/age-verifier.js
      - assets/age-verifier.css
    settings: [design_mode, enable, bg_image, bg_blur, decline_heading, decline_content, return_button]
    templates: []
    rationale: >
      Age-gate popup (localStorage cookie). The target niche (fashion/beauty) sells no
      age-restricted products, so the concept earns no place; not rendered by any shipped template.
      Reintroduce only if the store adds restricted categories.

  - id: quick_order_list
    name: Quick Order List (B2B bulk ordering)
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/quick-order-list.liquid
      - snippets/quick-order-list-row.liquid
      - assets/quick-order-list.js
      - assets/quick-order-list.css
    settings: [show_image, show_sku, heading, subheading, description]
    templates: []
    rationale: >
      Dawn-style bulk quantity ordering table for wholesale/B2B. Contradicts the direct-to-consumer
      fashion/beauty positioning, ships in no template, and drags a large Dawn-derived component
      (quick-order-list.js 18.5 KB) into the rebuild; drop.

  - id: notify
    name: Notify Container Snippet (dead code)
    class: REMOVE
    keep_concept: false
    keep_implementation: false
    files:
      - snippets/notify.liquid
    settings: []
    templates: []
    rationale: >
      Dead code: nothing renders snippets/notify.liquid and its markup is an empty notification
      wrapper. The live toast behavior lives in assets/notification.js (see notifications).

  - id: maps
    name: Google Maps Store Locator
    class: APP-LIKE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/maps.liquid
      - assets/google-map.js
    settings: [address, api_key, map_style, height, zoom, draggable, scroll_wheel]
    templates: []
    rationale: >
      Loads the Google Maps JavaScript API with a merchant-supplied API key (external service +
      per-merchant account) — a third-party SDK integration that cannot function with Liquid +
      storefront JS + Shopify resources alone, i.e. the app boundary per the classification guide.
      Recommend a theme app extension or a keyless iframe embed instead; APP-LIKE per the
      third-party-SDK row of the decision table.

  - id: foxkit_app_embeds
    name: FoxKit App Embeds (cart goal, countdown, upsell, summary)
    class: APP-LIKE
    keep_concept: false
    keep_implementation: false
    files:
      - snippets/cart-drawer.liquid
      - snippets/cart-drawer-item.liquid
      - sections/main-cart-items.liquid
      - sections/main-cart-footer.liquid
    settings: []
    templates: [all]
    rationale: >
      Shipped custom-element hooks for the third-party FoxKit app: <foxkit-cart-goal>,
      <foxkit-cart-countdown>, <foxkit-incart-upsell> and data-foxkit-cart-summary placeholders.
      These are app integration points by definition (theme app extension boundary per
      shopify.dev/docs/api/theme-app-extensions); keep only neutral containers if merchants use the
      app, never ship the app's functionality in the theme.

  - id: product_reviews
    name: Product Reviews Block
    class: APP-LIKE
    keep_concept: false
    keep_implementation: false
    files:
      - sections/product-information-tabs.liquid
    settings: []
    templates: []
    rationale: >
      Renders stored review HTML from product.metafields.spr.reviews. Customer reviews require
      moderation, storage and a third-party review service — the canonical APP-LIKE case in the
      classification guide. Theme should render review app blocks (via @app) instead of shipping
      review plumbing.

  - id: vendor_bundle
    name: Vendor JS Bundle (Flickity, jQuery, PhotoSwipe, tippy)
    class: RISKY
    keep_concept: true
    keep_implementation: false
    files:
      - assets/vendor.js
    settings: []
    templates: [all]
    rationale: >
      RISKY (licensing + weight): vendor.js (262 KB) bundles Flickity (GPL-3.0), jQuery (MIT),
      PhotoSwipe (MIT) and tippy with no shipped license texts — the banner references a
      vendor.js.LICENSE.txt that does not exist (source-audit.md §2/§3). GPL-3.0 Flickity inside a
      distributed theme is a copyleft conflict; the bundle loads on every page. Keep the concepts
      (carousels, lightbox zoom, tooltips) but re-implement with licensed/vanilla alternatives.

  - id: gsap_scroll_parallax
    name: GSAP Layered Images Parallax
    class: RISKY
    keep_concept: true
    keep_implementation: false
    files:
      - sections/layered-images.liquid
      - assets/gsap.js
      - assets/ScrollTrigger.js
      - assets/layered-images.js
      - assets/layered-images.css
    settings: [image_aspect_ratio, vertical_alignment]
    templates: []
    rationale: >
      RISKY (licensing + weight): loads gsap.js + ScrollTrigger.js (GreenSock Standard License
      3.12.2; headers present but no license text shipped — source-audit.md §2) for one decorative
      parallax section. The layered-image editorial concept can be rebuilt with CSS transforms/
      IntersectionObserver; do not carry the GSAP dependency.

# Notes on features classified by Theme Store requirement (fetched 2026-09-09 from
# https://shopify.dev/docs/storefronts/themes/store/requirements):
# - Sections Everywhere, Custom Liquid section, @app blocks, faceted filtering, gift card template,
#   newsletter, country/language selection, multi-level menus, pickup availability, related +
#   complementary recommendations, rich product media, predictive search, selling plans on cart,
#   unit pricing, variant images + swatches, Follow on Shop, account component, accelerated checkout.
```

## Handoff note

- [x] Every feature found by the scan appears in this file exactly once.
- [x] Every block has both booleans set (keep_implementation: false everywhere per reference-rebuild override).
- [x] Inventory path reported to shopify-theme-product-orchestrator for stage 3+ (commerce-ux-architect, shopify-liquid-architect).
