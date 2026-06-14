'use client';

/**
 * Dashboard Page  (route: /dashboard)
 * Shows stat cards, progress bar, recent problems, and weak-area
 * analysis derived from the user's real problem bank via the API.
 */

import Link from 'next/link';
import {
  BookOpen, CheckCircle2, XCircle, RefreshCw,
  TrendingUp, AlertTriangle, ArrowRight, Plus, AlertCircle,
} from 'lucide-react';
import { useProblems }    from '@/context/ProblemsContext';
import StatCard           from '@/components/dashboard/StatCard';
import { SkeletonStatCard } from '@/components/ui/LoadingSkeleton';

// ─── Colour helpers ───────────────────────────────────────────

const DIFF_COLOR: Record<string, string> = {
  Easy:   'text-[#22C55E]',
  Medium: 'text-[#F59E0B]',
  Hard:   'text-[#EF4444]',
};

const STATUS_CLASS: Record<string, string> = {
  Solved:   'bg-[#22C55E]/10 text-[#22C55E]',
  Revision: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  Unsolved: 'bg-[#475569]/20 text-[#94A3B8]',
};

// ─── Component ────────────────────────────────────────────────

export default function DashboardPage() {
  const { problems, isLoading, error } = useProblems();

  // ── Derived stats ──────────────────────────────────────────
  const total    = problems.length;
  const solved   = problems.filter(p => p.status === 'Solved').length;
  const unsolved = problems.filter(p => p.status === 'Unsolved').length;
  const revision = problems.filter(p => p.status === 'Revision').length;
  const pct      = total > 0 ? Math.round((solved / total) * 100) : 0;

  // Weak topics: tags most common among non-solved problems
  const tagCount: Record<string, number> = {};
  problems
    .filter(p => p.status !== 'Solved')
    .forEach(p => p.tags.forEach(t => { tagCount[t] = (tagCount[t] ?? 0) + 1; }));

  const weakTopics = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxWeak = weakTopics[0]?.[1] ?? 1;

  const recent = [...problems]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  // ── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-[#EF4444]" />
        </div>
        <h3 className="text-base font-semibold text-[#F1F5F9] mb-1">Failed to load dashboard</h3>
        <p className="text-sm text-[#475569] mb-5 max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-glow px-4 py-2 text-sm text-white font-semibold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Welcome banner ──────────────────────────────────── */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold text-[#6366F1] uppercase tracking-widest mb-1">Overview</p>
          <h2 className="text-xl font-bold text-[#F1F5F9]">
            You&apos;ve solved{' '}
            <span className="gradient-text">{isLoading ? '…' : solved}</span>{' '}
            problem{solved !== 1 ? 's' : ''}
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1 mb-4">
            Keep the streak going — consistency beats intensity.
          </p>
          {/* Progress bar */}
          <div className="flex items-center gap-3 max-w-sm">
            <div className="flex-1 bg-[#0D1117] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm text-[#94A3B8] shrink-0">
              <span className="text-[#818CF8] font-semibold">{pct}%</span> solved
            </span>
          </div>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Problems" value={total}    icon={BookOpen}    gradient="from-[#6366F1] to-[#8B5CF6]" />
            <StatCard title="Solved"          value={solved}   icon={CheckCircle2} gradient="from-[#22C55E] to-[#16A34A]" change={`${pct}% of total`} />
            <StatCard title="Unsolved"        value={unsolved} icon={XCircle}     gradient="from-[#EF4444] to-[#DC2626]" />
            <StatCard title="Needs Revision"  value={revision} icon={RefreshCw}   gradient="from-[#F59E0B] to-[#D97706]" />
          </>
        )}
      </div>

      {/* ── Bottom two-col grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent problems – 3 cols */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E2740] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-[#6366F1]" />
              <span className="text-sm font-semibold text-[#F1F5F9]">Recent Problems</span>
            </div>
            <Link
              href="/problems"
              className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors font-medium"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            /* Skeleton rows */
            <div className="divide-y divide-[#1E2740]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3 animate-pulse">
                  <div className="skeleton w-2 h-2 rounded-full" />
                  <div className="skeleton h-3.5 flex-1 max-w-[60%] rounded" />
                  <div className="skeleton h-4 w-14 rounded-full" />
                  <div className="skeleton h-4 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-xl bg-[#131A2B] border border-[#1E2740] flex items-center justify-center mb-3">
                <Plus size={20} className="text-[#475569]" />
              </div>
              <p className="text-sm text-[#94A3B8] mb-1">No problems yet</p>
              <Link href="/problems" className="text-xs text-[#6366F1] hover:underline">
                Add your first problem →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#1E2740]">
              {recent.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-[#0D1117] transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    p.status === 'Solved' ? 'bg-[#22C55E]' :
                    p.status === 'Revision' ? 'bg-[#F59E0B]' : 'bg-[#475569]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F1F5F9] truncate font-medium">{p.title}</p>
                    <p className="text-xs text-[#475569] mt-0.5">{p.platform} · {p.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold ${DIFF_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_CLASS[p.status]}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak areas – 2 cols */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E2740] flex items-center gap-2">
            <AlertTriangle size={15} className="text-[#F59E0B]" />
            <span className="text-sm font-semibold text-[#F1F5F9]">Weak Areas</span>
          </div>

          <div className="p-5 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-1.5">
                  <div className="flex justify-between">
                    <div className="skeleton h-3.5 w-24 rounded" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                  <div className="skeleton h-1.5 w-full rounded-full" />
                </div>
              ))
            ) : weakTopics.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 size={28} className="text-[#22C55E] mx-auto mb-2" />
                <p className="text-sm text-[#94A3B8]">No weak areas — great work!</p>
              </div>
            ) : (
              weakTopics.map(([tag, count]) => (
                <div key={tag}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#94A3B8] font-medium">{tag}</span>
                    <span className="text-xs text-[#475569]">{count} to tackle</span>
                  </div>
                  <div className="bg-[#0D1117] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] transition-all duration-700"
                      style={{ width: `${Math.min((count / maxWeak) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Difficulty breakdown */}
          {!isLoading && (
            <div className="px-5 pb-5 pt-1 border-t border-[#1E2740] mt-2">
              <p className="text-[10px] uppercase tracking-widest text-[#475569] font-semibold mb-3">
                Difficulty breakdown
              </p>
              <div className="flex gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map(d => {
                  const c = problems.filter(p => p.difficulty === d).length;
                  return (
                    <div key={d} className="flex-1 text-center">
                      <p className={`text-xl font-bold ${DIFF_COLOR[d]}`}>{c}</p>
                      <p className="text-[10px] text-[#475569] mt-0.5">{d}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}