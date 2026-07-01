export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      <div className="h-5 w-64 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex gap-5">
            <div className="h-28 w-28 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-5 w-52 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-xl border bg-muted/50" />
      </div>
    </div>
  );
}
