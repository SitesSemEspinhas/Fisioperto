export default function Loading() {
  return (
    <div className="container py-10 md:py-14">
      <div className="h-9 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-6 h-24 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl border bg-muted/50"
          />
        ))}
      </div>
    </div>
  );
}
