/**
 * app/(app)/loading.tsx
 * Next.js Suspense loading UI for the authenticated app section.
 * Shown automatically by the router while a page is streaming in.
 * Uses the same sidebar/navbar shell so layout doesn't flash.
 */

export default function AppLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">

      {/* Welcome banner skeleton */}
      <div className="skeleton h-28 w-full rounded-xl" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>

      {/* Bottom two-col */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 skeleton h-72 rounded-xl" />
        <div className="lg:col-span-2 skeleton h-72 rounded-xl" />
      </div>
    </div>
  );
}