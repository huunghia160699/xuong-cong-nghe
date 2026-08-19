# Architecture Decision Log

## ADR-001 — Một repository

**Chọn:** monorepo đơn giản cho web, Supabase và docs. **Lý do:** MVP nhỏ, giảm chi phí phối hợp và giúp coding agent hiểu toàn hệ thống.

## ADR-002 — Next.js App Router

**Chọn:** route groups cho public, student, admin. **Lý do:** layout tách biệt, SEO tốt cho public và vẫn hỗ trợ app tương tác.

## ADR-003 — Mock-first, Supabase-ready

**Chọn:** UI mặc định dùng mock data; Supabase qua repository adapter. **Lý do:** giao diện chạy ngay, phát triển UI không phụ thuộc hạ tầng nhưng không tạo ngõ cụt kiến trúc.

## ADR-004 — Local shadcn-style primitives

**Chọn:** component nhỏ, sở hữu trong repo thay vì phụ thuộc nguyên bộ UI. **Lý do:** dễ tùy biến đúng brand và giữ bundle gọn.

## ADR-005 — Teacher có trong kiến trúc, chưa mở sản phẩm

**Chọn:** role/schema sẵn sàng, feature flag tắt. **Lý do:** tránh migration khó về sau mà vẫn giữ phạm vi MVP.

## ADR-006 — Lime là accent, không phải nền mặc định

**Chọn:** trung tính 90%, lime cho CTA/tiến độ. **Lý do:** tạo dấu hiệu nhận diện nhưng giữ cảm giác chuyên nghiệp, ít nhiễu.
