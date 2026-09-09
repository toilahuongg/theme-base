# Showcase State

Updated by the showcase-setup skill after every phase. This is the working record for a showcase build.

## Store

- Chosen store (customer-confirmed): `__STORE__.myshopify.com`
- Theme id: `__THEME_ID__` (name: `__THEME_NAME__`, role: `__ROLE__`)
- Showcase language: `__LANG__`
- Plan: docs/showcase-plan.md (if present)

## Environment

- Shopify CLI: working / blocked — note Node version used
- Token scopes: read_themes ✓ / write_themes ✓ / products ✓ / collections ✓ / pages ✓ / articles ✓ / read_menus ✗ / write_menus ✗ (strike missing ones)
- Repo ↔ store sync: pulled `__DATE__` / confirmed match

## Gap list (Phase 2)

| Template / block | Referenced handle | Exists on store? | Action |
| --- | --- | --- | --- |
|  |  | YES / NO | create / assign / leave |
|  |  |  |  |

## Resource map (handle → id)

| Type | Handle | Store id | Created / existed |
| --- | --- | --- | --- |
| product |  | gid://shopify/Product/… | created |
| collection |  |  | existed |
| page |  |  | created |
| article |  |  | created |
| menu |  |  | created (admin manual) |

## Images

- Generated via imagen: list files
- Supplied by customer: list

## Template walk-through (Phase 8)

| Template | Rendered OK? | Notes / blockers |
| --- | --- | --- |
| index |  |  |
| product.stacked |  |  |
| product.thumbnails-carousel |  |  |
| product.grid-mix |  |  |
| collection (+ 4 banner variants) |  |  |
| page.about-us / about-us-2 / lookbook / find-a-store / faqs / contact |  |  |
| blog / article |  |  |
| cart / search / 404 / password / list-collections / gift_card / customers/* |  |  |

## Blockers

- (none) or list with reason and who resolves
