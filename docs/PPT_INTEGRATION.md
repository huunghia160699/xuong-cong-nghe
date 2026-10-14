# Tích hợp thư viện trình chiếu vào Xưởng Công Nghệ

## Nguồn gốc và phạm vi

- Repository nguồn riêng: `huunghia160699/dev-Ppt_Website` (đọc tại commit `e81104f08ddaa853bd4c331d4a106be8ce9a4be8`).
- Đã sao chép **14 file hoạt động**: 2 trang HTML, CSS, dữ liệu môn/lớp/bài và toàn bộ mô-đun JavaScript. Không sửa repo nguồn.
- Bài có thật: `Tin học cơ bản → Buổi 01: File Explorer` gồm **29 slide**, **5 quiz**, các mô phỏng, phím tắt và ghi chú giảng viên.
- Thư viện giới thiệu **15 layout**; lớp được khai báo thực tế là `HL.26-27`.
- Các tài liệu, bố cục và chức năng gốc được giữ lại; một liên kết trở về Xưởng Công Nghệ được thêm trong danh mục riêng.

## Vị trí truy cập

- Trang Công cụ: `/cong-cu`
- Giao diện tích hợp: `/cong-cu/trinh-chieu`
- Thư viện độc lập cùng tên miền: `/apps/ppt/index.html`
- Bài giảng lớp HL.26-27:
  `/apps/ppt/slides.html?course=tin-hoc-co-ban&lesson=buoi-01-file-explorer&class=hl-26-27`
- Thư viện 15 mẫu: `/apps/ppt/slides.html?course=tin-hoc-co-ban&lesson=layout-gallery`

## Kiến trúc kỹ thuật

- `public/apps/ppt/` chứa thư viện nguyên bản chạy bằng ES Modules, cô lập CSS/DOM.
- `src/app/(public)/cong-cu/trinh-chieu/page.tsx` nhúng thư viện **cùng nguồn** bằng iframe; cho phép mở slide riêng để dùng phím tắt và fullscreen.
- `src/config/navigation.ts` và trang chủ giới thiệu công cụ mới; giao diện bên ngoài theo design system Xưởng Công Nghệ.
- `scripts/validate-ppt.mjs` và `tests/ppt-engine.test.mjs` kiểm tra dữ liệu, layout, quiz, escape HTML và liên kết lớp.
- Không thêm dependency, database, khóa API hay hosting. Công cụ hiện **công khai** khi website được triển khai vì tài nguyên nằm trong thư mục `public/`.

## Giới hạn / tiếp tục phát triển

- **Không** có kéo thả tạo slide, xuất `.pptx`, đồng bộ điểm với Supabase hay phân quyền riêng cho bài giảng.
- Slide/data copy tại commit nguồn được **đóng băng**; các commit tương lai vào repo `dev-Ppt_Website` chưa tự cập nhật website chính.
- Muốn đồng bộ: lấy phần `index.html`, `slides.html`, `assets/` từ commit nguồn mới; giữ liên kết "← Xưởng Công Nghệ"; chạy `node scripts/validate-ppt.mjs`, `pnpm test`, `pnpm typecheck`, `pnpm build` và kiểm tra slide tương tác.
- Chỉ sao chép dữ liệu nguồn thuộc quyền sử dụng và được phép công khai; đừng đưa bài giảng riêng, dữ liệu học viên hoặc khóa API vào static `public/`.

