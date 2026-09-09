# Showcase Plan — Theme Veloura

## 1. Mục tiêu

Dựng demo storefront hoàn chỉnh trình diễn toàn bộ khả năng của theme Veloura:
mọi template render được với nội dung thật (không Lorem Ipsum, không block rỗng),
settings hoàn chỉnh, sẵn sàng giới thiệu khách hàng hoặc dùng làm demo store.

## 2. Hiện trạng (đã kiểm kê ngày 2026-09-09)

### Theme (repo `theme-base`)
- Tên: **Veloura** v1.0.0 (config/settings_schema.json → theme_info)
- 25 templates JSON/Liquid, ~80 sections, 44 locale files (default: `en.default`)
- Templates đã dựng sẵn nội dung: index (47KB), page.about-us (32KB), page.lookbook,
  page.find-a-store, page.faqs, page.contact, product × 4 biến thể, collection × 5 biến thể
- 4 page templates **chưa có page tương ứng trên store**: `page.about-us`,
  `page.about-us-2`, `page.lookbook`, `page.find-a-store`, `page.faqs`
- `templates/metaobject/` rỗng; store chưa có metaobject definition nào

### Store (epi-accesorios.myshopify.com — Epiphany Accesorios, JPY)
- Theme active: **Laura** (id 181389951275) = role MAIN (đang publish); theme **Rise** unpublished
- Content:
  - ~70 sản phẩm ACTIVE (pulseras, collares, anillos, aretes, diademas, boxes) + 4 DRAFT
  - 26 collections (aretes, pulseras, collares, anillos, golden-forever, sakura-bloom, fusion, …)
  - 5 pages: contact, data-sharing-opt-out, wishlist, nosotros, legal JP (特定商取引法に基づく表記)
  - Blog `news` — **0 bài viết**
- Homepage `index.json`: 8 block collection + 6 block product đang **rỗng** (cần gán content thật)
- Social links đã cấu hình: Facebook, Instagram, WhatsApp
- Màu đã set: text `#121212`, solid button label `#FFFFFF`; font chưa kiểm tra đủ

### Tooling
- Shopify CLI cài global nhưng **hỏng với node v20.19.5**
  (`SyntaxError: node:module does not provide 'enableCompileCache'`) → cần node ≥ 22.
  Máy đã có **node v22.21.1** qua nvm.
- `scripts/pull-theme.mjs` pull theme qua Admin API (token read_themes OK)
- Token thiếu scope đọc **menus** (`ACCESS_DENIED`) → tạo menu qua admin/CLI, không qua API này

## 3. Các pha triển khai

### Pha 0 — Chuẩn bị tooling
- `nvm use 22` (hoặc default node lên 22) → verify `shopify version`
- Xác nhận token có scope `write_themes` để push (hoặc dùng `shopify theme push` sau khi login)
- Đồng bộ repo ↔ store bằng `pull-theme.mjs` trước khi sửa (tránh ghi đè)

### Pha 1 — Content framework
- Tạo pages trên store khớp từng page template: `about-us`, `about-us-2`,
  `lookbook`, `find-a-store`, `faqs` (nội dung thật, tiếng Tây Ban Nha — ngôn ngữ store)
- Viết **6–8 bài blog** cho blog `news` (có ảnh) để `blog.json`/`article.json` hiển thị đầy đủ
- Điền **8 collection + 6 product rỗng** trên homepage bằng handle thật của store
- Gán ảnh đại diện + mô tả cho collections chưa có (kiểm tra trên admin)

### Pha 2 — Menus & settings
- Tạo menus `main-menu` và `footer` (settings_data đang trỏ 2 handle này) khớp
  cấu trúc header/footer của theme
- Hoàn thiện `config/settings_data.json`: color schemes đủ 4+ màu (chuẩn Theme Store),
  fonts (heading/body), announcement bar, popup, countdown, layout width
- Bổ sung `presets` cho các section chính nếu thiếu (Theme Editor hiển thị mẫu chuẩn)

### Pha 3 — Template coverage
- Gán 3 sản phẩm đại diện cho 3 biến thể product template:
  `product.stacked`, `product.thumbnails-carousel`, `product.grid-mix`
- Gán 4 collections cho 4 biến thể collection banner
  (`banner-as-background`, `banner-left`, `banner-right`, `banner-top`) + `without-image`
- Kiểm tra render: cart, search, 404, password, list-collections, gift_card, customers/*

### Pha 4 — QA
- `shopify theme check` (config `.theme-check.yml` sẵn có)
- Lighthouse home/product/collection — desktop + mobile
- Responsive + editor preview (cấu hình section/block từ Theme Editor)

### Pha 5 — Deploy & demo
- Push theme lên store, publish (hoặc giữ unpublished + preview link)
- Walk-through toàn bộ template, chụp evidence, cập nhật plan này → trạng thái DONE

## 4. Quyết định cần chốt

1. **Showcase chạy trên store nào?**
   - (A) Ngay trên `epi-accesorios` (theme Laura đang MAIN) — nhanh, đúng content thật,
     nhưng đụng storefront đang chạy
   - (B) Tạo demo store riêng, push theme + content sang — an toàn, đúng mô hình Theme Store,
     tốn thời gian set up store/content
   - **Đề xuất: (A)** nếu epi-accesorios là store dev của khách; (B) nếu là production.
2. **Ngôn ngữ nội dung showcase:** tiếng Tây Ban Nha (khớp store) hay tiếng Anh (khớp default locale)?

## 5. Định nghĩa "Done"

- Mọi template render được với nội dung thật; homepage không còn block rỗng
- Menus, settings_data, presets hoàn chỉnh; Theme Editor không lỗi schema
- `theme check` green; Lighthouse đạt ngưỡng tối thiểu home/product/collection
- Có preview link công khai (hoặc screenshot evidence từng template)

## 6. Rủi ro

- Shopify CLI cần node ≥ 22 — đã có fix (nvm)
- Token thiếu scope menus → tạo menu thủ công trên admin
- Nội dung hỗn hợp ngôn ngữ (es/ja/vi/en) — cần chốt 1 ngôn ngữ chính cho showcase
