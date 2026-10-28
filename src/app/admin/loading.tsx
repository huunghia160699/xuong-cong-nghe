/** Instant fallback for Admin route transitions and server data loading. */
export default function AdminLoading() {
  return (
    <div className="xcn-admin xcn-admin-loading" role="status" aria-live="polite" aria-label="Đang tải nội dung quản trị">
      <div className="xcn-admin-loading-progress" aria-hidden="true"><span /></div>
      <div className="flex flex-wrap items-start justify-between gap-5 py-4" aria-hidden="true">
        <div className="w-full max-w-lg space-y-3">
          <div className="h-3 w-28 rounded-full bg-slate-200 motion-safe:animate-pulse" />
          <div className="h-9 w-64 max-w-full rounded-lg bg-slate-200 motion-safe:animate-pulse" />
          <div className="h-3 w-72 max-w-full rounded-full bg-slate-100 motion-safe:animate-pulse" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-slate-100 motion-safe:animate-pulse" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-3 w-20 max-w-full rounded-full bg-slate-100 motion-safe:animate-pulse" />
            <div className="mt-4 h-8 w-16 rounded-lg bg-slate-200 motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]" aria-hidden="true">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-5 h-5 w-36 rounded bg-slate-200 motion-safe:animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-20 rounded-lg bg-slate-100 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-5 h-5 w-28 rounded bg-slate-200 motion-safe:animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-11 rounded-lg bg-slate-100 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Đang tải nội dung quản trị…</span>
    </div>
  );
}
