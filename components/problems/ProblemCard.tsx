/**
 * ProblemCard component
 * Renders a single problem entry in either card (grid) or list-row mode.
 * Shows title, platform badge, difficulty, status, tags, notes preview
 * and action buttons: Open (external link) and Edit.
 */

import { ExternalLink, Edit2, Tag, FileText, AlertCircle } from 'lucide-react';
import { Problem } from '@/types';

// ─── Colour maps ──────────────────────────────────────────────

const DIFF_STYLES: Record<string, string> = {
  Easy:   'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/25',
  Medium: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/25',
  Hard:   'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25',
};

const STATUS_STYLES: Record<string, string> = {
  Solved:   'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
  Revision: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
  Unsolved: 'text-[#94A3B8] bg-[#475569]/15 border-[#475569]/20',
};

const PLATFORM_STYLES: Record<string, string> = {
  LeetCode:     'text-[#FFA116] bg-[#FFA116]/10 border-[#FFA116]/20',
  GeeksForGeeks:'text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/20',
  HackerRank:   'text-[#39C16C] bg-[#39C16C]/10 border-[#39C16C]/20',
  CodeForces:   'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
  Other:        'text-[#94A3B8] bg-[#475569]/15 border-[#475569]/20',
};

// ─── Props ────────────────────────────────────────────────────

interface ProblemCardProps {
  problem:  Problem;
  onEdit:   (p: Problem) => void;
  listMode?: boolean;
}

// ─── Shared chip component ────────────────────────────────────

function Chip({ label, style }: { label: string; style: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border ${style}`}>
      {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function ProblemCard({ problem, onEdit, listMode = false }: ProblemCardProps) {
  const platformStyle = PLATFORM_STYLES[problem.platform] ?? PLATFORM_STYLES['Other'];

  // ── List row ──────────────────────────────────────────────
  if (listMode) {
    return (
      <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#0D1117] transition-colors group">
        {/* Status dot */}
        <span className={`w-2 h-2 rounded-full shrink-0 ${
          problem.status === 'Solved'   ? 'bg-[#22C55E]' :
          problem.status === 'Revision' ? 'bg-[#F59E0B]' : 'bg-[#475569]'
        }`} />

        {/* Title */}
        <p className="flex-1 text-sm text-[#F1F5F9] font-medium truncate group-hover:text-[#818CF8] transition-colors">
          {problem.title}
        </p>

        {/* Chips */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <Chip label={problem.platform}   style={platformStyle} />
          <Chip label={problem.difficulty} style={DIFF_STYLES[problem.difficulty]} />
          <Chip label={problem.status}     style={STATUS_STYLES[problem.status]} />
        </div>

        {/* Tags (first 2) */}
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {problem.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#131A2B] border border-[#1E2740] text-[#475569]">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {problem.link && (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-[#475569] hover:text-[#818CF8] hover:bg-[#6366F1]/10 transition-all"
              title="Open problem"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={() => onEdit(problem)}
            className="p-1.5 rounded-lg text-[#475569] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all"
            title="Edit problem"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Card (grid) view ──────────────────────────────────────
  return (
    <div className="card flex flex-col gap-3 p-5 group">

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#F1F5F9] leading-snug group-hover:text-[#818CF8] transition-colors line-clamp-2 flex-1">
          {problem.title}
        </h3>
        <Chip label={problem.difficulty} style={`${DIFF_STYLES[problem.difficulty]} shrink-0`} />
      </div>

      {/* Platform + status */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Chip label={problem.platform} style={platformStyle} />
        <Chip label={problem.status}   style={STATUS_STYLES[problem.status]} />
      </div>

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {problem.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#0D1117] border border-[#1E2740] text-[#94A3B8]"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
          {problem.tags.length > 3 && (
            <span className="text-[10px] text-[#475569]">+{problem.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Notes preview */}
      {problem.notes && (
        <p className="flex items-start gap-1.5 text-[11px] text-[#475569] line-clamp-1">
          <FileText size={11} className="shrink-0 mt-px" />
          {problem.notes}
        </p>
      )}

      {/* Mistakes preview */}
      {problem.mistakes && (
        <p className="flex items-start gap-1.5 text-[11px] text-[#EF4444]/70 line-clamp-1">
          <AlertCircle size={11} className="shrink-0 mt-px" />
          {problem.mistakes}
        </p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#1E2740]">
        {problem.link ? (
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow flex items-center gap-1.5 text-xs px-3 py-1.5 text-white rounded-lg font-semibold flex-1 justify-center"
          >
            <ExternalLink size={12} />
            Open
          </a>
        ) : (
          <span className="flex-1 text-xs text-center text-[#475569] italic">No link</span>
        )}

        <button
          onClick={() => onEdit(problem)}
          className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
        >
          <Edit2 size={12} />
          Edit
        </button>
      </div>
    </div>
  );
}