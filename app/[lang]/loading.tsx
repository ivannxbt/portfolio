export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header skeleton */}
      <div className="h-20 border-b border-neutral-900" />

      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-6 pt-40">
        {/* Subtitle skeleton */}
        <div className="h-8 w-3/4 bg-white/5 rounded mb-6 animate-pulse" />

        {/* Main title skeleton */}
        <div className="space-y-4 mb-6">
          <div className="h-12 w-2/3 bg-white/10 rounded animate-pulse" />
          <div className="h-12 w-1/2 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-3 mb-12">
          <div className="h-6 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-6 w-5/6 bg-white/5 rounded animate-pulse" />
        </div>

        {/* CTA buttons skeleton */}
        <div className="flex gap-4">
          <div className="h-12 w-40 bg-white/10 rounded animate-pulse" />
          <div className="h-12 w-40 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Experience section skeleton */}
      <div className="max-w-5xl mx-auto px-6 pt-32">
        <div className="h-10 w-64 bg-white/10 rounded mb-12 animate-pulse" />

        {/* Timeline items skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6">
              <div className="w-2 h-2 bg-white/20 rounded-full mt-2" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-1/2 bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-1/3 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
