export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between gap-2">
        <div className="skeleton h-4 w-3/5 rounded" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="flex gap-2 pt-1 border-t border-[#1E2740]">
        <div className="skeleton h-8 flex-1 rounded-lg" />
        <div className="skeleton h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}
export function SkeletonCardGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
export function SkeletonStatCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}