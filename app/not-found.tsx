'use client';
/**
 * app/not-found.tsx
 * Custom 404 page – rendered by Next.js whenever notFound() is
 * called or a route simply doesn't exist.
 */

import Link from 'next/link';
import { Brain, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 text-center">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6366F1]/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative animate-fadeUp max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Brain size={17} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#F1F5F9]">AlgoVault</span>
        </div>

        {/* 404 display */}
        <p className="text-8xl font-extrabold gradient-text leading-none mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#F1F5F9] mb-3">Page not found</h1>
        <p className="text-[#94A3B8] text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/dashboard"
            className="btn-glow flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl text-sm"
          >
            <Home size={15} />
            Go to Dashboard
          </Link>
          <button
            onClick={() => history.back()}
            className="btn-ghost flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-sm"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}