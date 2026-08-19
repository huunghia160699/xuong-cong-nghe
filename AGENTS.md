# AGENTS.md — Xưởng Công Nghệ

## Product

Xưởng Công Nghệ is a Vietnamese learning and practice platform for digital skills. Its core loop is **Học → Luyện → Ứng dụng**. The five public pillars are Khóa học, Luyện tập, Tài nguyên, Công cụ, and Dự án.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn-style local primitives in `src/components/ui`
- Supabase Auth, Postgres, Storage, and RLS
- Mock data is the default until Supabase environment variables are configured

## Non-negotiable rules

1. Keep UI copy in Vietnamese and code identifiers in English.
2. Preserve the Minimal Education SaaS visual system: neutral base, whitespace, thin borders, small radii, minimal shadows, lime only as a focused accent.
3. Do not copy layouts, assets, or code from montinhoc.vn. It is mood-level inspiration only.
4. Put route composition in `src/app`, domain logic in `src/features`, reusable UI in `src/components`, infrastructure in `src/lib`, and constants in `src/config`.
5. Do not call Supabase directly from presentation components. Use a feature repository/service layer.
6. Every new table must ship as a migration with RLS policies. Never edit an applied migration.
7. Every new screen must have loading, empty, error, and mobile behavior before it is considered complete.
8. Keep teacher workspace, payments, AI tutor, and Word Lab behind feature flags until their roadmap phase.

## Definition of done

- `npm run typecheck` and `npm run build` pass.
- Main flows work at 360px, 768px, and 1280px widths.
- Interactive controls have keyboard focus and accessible labels.
- No secrets or real user data are committed.
- Related docs and mock data are updated with behavior changes.

## Key references

Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, and `docs/DECISIONS.md` before large changes.
