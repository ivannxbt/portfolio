export default function Loading() {
  return (
    <div className="min-h-dvh bg-[#1a1a1a]">
      {/* Header skeleton */}
      <div className="h-20 border-b border-neutral-900" />

      {/* Hero skeleton */}
      <div className="mx-auto max-w-5xl px-6 pt-40">
        {/* Subtitle skeleton */}
        <div className="mb-6 h-8 w-3/4 animate-pulse rounded bg-white/5" />

        {/* Main title skeleton */}
        <div className="mb-6 space-y-4">
          <div className="h-12 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="h-12 w-1/2 animate-pulse rounded bg-white/10" />
        </div>

        {/* Description skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-6 w-full animate-pulse rounded bg-white/5" />
          <div className="h-6 w-5/6 animate-pulse rounded bg-white/5" />
        </div>

        {/* CTA buttons skeleton */}
        <div className="flex gap-4">
          <div className="h-12 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-12 w-40 animate-pulse rounded bg-white/5" />
        </div>
      </div>

      {/* Experience section skeleton */}
      <div className="mx-auto max-w-5xl px-6 pt-32">
        <div className="mb-12 h-10 w-64 animate-pulse rounded bg-white/10" />

        {/* Timeline items skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6">
              <div className="mt-2 h-2 w-2 rounded-full bg-white/20" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="h-6 w-1/3 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
