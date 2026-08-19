# Architecture v1.0

## Hướng phụ thuộc

```text
app routes
  → features / presentation components
    → repositories / services
      → Supabase client or mock adapter
```

UI không biết dữ liệu đến từ mock hay Supabase. Giai đoạn tiếp theo tạo interface repository theo từng feature (`courses`, `learning`, `quiz`, `admin`) rồi chọn adapter bằng feature flag.

## Ranh giới thư mục

- `src/app`: route, layout, metadata, server actions.
- `src/features/<domain>`: model, repository, queries, feature UI.
- `src/components/ui`: primitive không chứa business logic.
- `src/components`: shell và pattern dùng nhiều domain.
- `src/config`: navigation, feature flag, product constants.
- `src/lib`: client Supabase, validation, shared utilities.
- `src/data`: dữ liệu giả phục vụ UI và test.

## Render và bảo mật

Public content ưu tiên Server Components. Quiz/player dùng Client Components cho trạng thái tương tác. Route admin kiểm tra session/role ở server khi auth được nối. RLS là lớp bắt buộc cuối cùng; middleware không thay thế RLS.

## Môi trường

Local mặc định mock. Preview/production dùng Supabase riêng, migration đồng bộ qua CI. Không commit `.env.local` hay service-role key.
