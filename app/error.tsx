'use client';

/**
 * app/error.tsx
 * Next.js error boundary – catches unhandled runtime errors inside
 * the root layout and shows a friendly recovery screen.
 * The `reset` function attempts to re-render the segment.
 */

import { useEffect }  from 'react';
import Link           from 'next/link';
import { Brain, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error('[Unhandled Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 text-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#EF4444]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative animate-fadeUp max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Brain size={17} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#F1F5F9]">AlgoVault</span>
        </div>

        {/* Error icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-[#F1F5F9] mb-3">Something went wrong</h1>
        <p className="text-[#94A3B8] text-sm mb-3 leading-relaxed">
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
        </p>

        {/* Show digest in dev for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-[#EF4444]/70 font-mono bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-lg px-3 py-2 mb-6 break-all">
            {error.message}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
          <button
            onClick={reset}
            className="btn-glow flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl text-sm"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="btn-ghost flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-sm"
          >
            <Home size={15} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}