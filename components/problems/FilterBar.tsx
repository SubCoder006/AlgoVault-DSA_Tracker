'use client';

/**
 * FilterBar component
 * Renders a responsive row containing a search input, three dropdown
 * filters (Platform, Difficulty, Status) and a "Clear" button shown
 * whenever any filter is active.
 */

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types';

// ─── Option sets ──────────────────────────────────────────────

const PLATFORMS   = ['All', 'LeetCode', 'GeeksForGeeks', 'HackerRank', 'CodeForces', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES    = ['All', 'Solved', 'Unsolved', 'Revision'];

// ─── Props ────────────────────────────────────────────────────

interface FilterBarProps {
  filters:      FilterState;
  onChange:     (f: FilterState) => void;
  resultCount:  number;
}

// ─── Shared select style ──────────────────────────────────────

const SELECT_CLS =
  'bg-[#131A2B] border border-[#1E2740] rounded-lg px-3 py-2 text-sm ' +
  'text-[#94A3B8] outline-none transition-colors cursor-pointer ' +
  'hover:border-[#263354] focus:border-[#6366F1]/50 appearance-none pr-8';

// ─── Component ────────────────────────────────────────────────

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const hasActive =
    filters.search        !== '' ||
    filters.platform      !== 'All' ||
    filters.difficulty    !== 'All' ||
    filters.status        !== 'All' ||
    filters.tag           !== '';

  const clearAll = () =>
    onChange({ search: '', platform: 'All', difficulty: 'All', status: 'All', tag: '' });

  const patch = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial });

  // Difficulty colour for selected state
  const diffColour =
    filters.difficulty === 'Easy'   ? 'text-[#22C55E]' :
    filters.difficulty === 'Medium' ? 'text-[#F59E0B]' :
    filters.difficulty === 'Hard'   ? 'text-[#EF4444]' :
    'text-[#94A3B8]';

  return (
    <div className="space-y-2.5">

      {/* ── Row ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2.5">

        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-[#131A2B] border border-[#1E2740] rounded-lg px-3 py-2 focus-within:border-[#6366F1]/50 transition-colors">
          <Search size={15} className="text-[#475569] shrink-0" />
          <input
            type="text"
            value={filters.search}
            onChange={e => patch({ search: e.target.value })}
            placeholder="Search problems…"
            className="bg-transparent text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none w-full"
          />
          {filters.search && (
            <button
              onClick={() => patch({ search: '' })}
              className="text-[#475569] hover:text-[#94A3B8] transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdowns group */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={15} className="text-[#475569] shrink-0 hidden sm:block" />

          {/* Platform */}
          <div className="relative">
            <select
              value={filters.platform}
              onChange={e => patch({ platform: e.target.value })}
              className={`${SELECT_CLS} ${filters.platform !== 'All' ? 'border-[#6366F1]/40 text-[#818CF8]' : ''}`}
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569]">▾</span>
          </div>

          {/* Difficulty */}
          <div className="relative">
            <select
              value={filters.difficulty}
              onChange={e => patch({ difficulty: e.target.value })}
              className={`${SELECT_CLS} ${filters.difficulty !== 'All' ? `border-[#6366F1]/40 ${diffColour}` : ''}`}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569]">▾</span>
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={e => patch({ status: e.target.value })}
              className={`${SELECT_CLS} ${filters.status !== 'All' ? 'border-[#6366F1]/40 text-[#818CF8]' : ''}`}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569]">▾</span>
          </div>

          {/* Clear button */}
          {hasActive && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/20 transition-all"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Result count ─────────────────────────────────── */}
      <p className="text-xs text-[#475569]">
        Showing{' '}
        <span className="text-[#94A3B8] font-medium">{resultCount}</span>{' '}
        problem{resultCount !== 1 ? 's' : ''}
        {hasActive && <span className="text-[#6366F1]"> (filtered)</span>}
      </p>
    </div>
  );
}