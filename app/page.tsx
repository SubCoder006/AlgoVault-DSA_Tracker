'use client';

/**
 * Landing Page  (route: /)
 * Public-facing marketing page with hero, preview stats, feature grid
 * and final CTA. No authentication required.
 */

import Link from 'next/link';
import {
  Brain, ArrowRight, BarChart3, Target, RefreshCw,
  CheckCircle2, Star, Zap, BookOpen,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const previewStats = [
  { label: 'Total Problems', value: '247', icon: BookOpen,      gradient: 'from-[#6366F1] to-[#8B5CF6]' },
  { label: 'Solved',          value: '183', icon: CheckCircle2, gradient: 'from-[#22C55E] to-[#16A34A]'  },
  { label: 'Needs Revision',  value: '28',  icon: RefreshCw,    gradient: 'from-[#F59E0B] to-[#D97706]'  },
];

const features = [
  {
    icon: Target,
    title: 'Track Every Problem',
    desc: 'Log problems from LeetCode, GFG, HackerRank and more. Add notes, tags, and custom difficulty.',
  },
  {
    icon: BarChart3,
    title: 'Identify Weak Areas',
    desc: 'See which topics appear most in your unsolved and revision problems — fix the gaps fast.',
  },
  {
    icon: RefreshCw,
    title: 'Smarter Revision',
    desc: 'Mark problems for revision and come back to them. Never forget a key pattern again.',
  },
  {
    icon: Zap,
    title: 'Stay Consistent',
    desc: 'A clean dashboard keeps you focused. See progress at a glance and build a study habit.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F1F5F9]">

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E2740]/60 bg-[#070B14]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <Brain size={15} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AlgoVault</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors rounded-lg hover:bg-[#131A2B]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-glow px-4 py-2 text-sm font-semibold text-white rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[500px] bg-[#6366F1]/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/4  w-60 h-60 bg-[#8B5CF6]/6 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/5 w-80 h-80 bg-[#6366F1]/4 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative animate-fadeUp">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#6366F1]/10 border border-[#6366F1]/25 rounded-full text-xs text-[#818CF8] font-medium mb-8">
            <Star size={11} className="fill-[#818CF8]" />
            The ultimate DSA study companion
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            <span className="text-[#F1F5F9]">Master </span>
            <span className="gradient-text">Algorithms</span>
            <br />
            <span className="text-[#F1F5F9]">with Purpose</span>
          </h1>

          <p className="text-lg text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed">
            Track problems, identify weak areas, revise smarter.
            Build the discipline to crack any coding interview.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="btn-glow flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl text-base"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/login"
              className="btn-ghost flex items-center gap-2 px-7 py-3.5 font-medium rounded-xl text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Preview stat cards ───────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[10px] font-semibold text-[#475569] uppercase tracking-[.2em] mb-6">
            Dashboard Preview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previewStats.map((s) => (
              <div key={s.label} className="card p-5 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${s.gradient} opacity-5 blur-xl group-hover:opacity-10 transition-opacity rounded-full`} />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-[#475569] mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-[#F1F5F9]">{s.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${s.gradient}`}>
                    <s.icon size={18} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F1F5F9] mb-3">
              Everything you need to improve
            </h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto text-sm leading-relaxed">
              AlgoVault gives you structure to study systematically and never let
              important problems slip through the cracks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="card p-6 group">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center mb-4 group-hover:bg-[#6366F1]/20 transition-all">
                  <f.icon size={18} className="text-[#818CF8]" />
                </div>
                <h3 className="font-semibold text-[#F1F5F9] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative card p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/6 to-[#8B5CF6]/4 pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-[#F1F5F9] mb-3">
                Ready to crack your next interview?
              </h2>
              <p className="text-[#94A3B8] mb-7 text-sm">
                Start tracking today — free, no credit card required.
              </p>
              <Link
                href="/signup"
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl"
              >
                Start for Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#1E2740] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <Brain size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-[#94A3B8]">AlgoVault</span>
          </div>
          <p className="text-xs text-[#475569]">Built for coders who want to improve</p>
        </div>
      </footer>
    </div>
  );
}