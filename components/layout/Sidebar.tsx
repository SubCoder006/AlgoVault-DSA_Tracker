'use client';

/**
 * Sidebar component
 * On desktop (lg+): always-visible fixed panel, 240 px wide.
 * On mobile: off-canvas drawer — slides in when isOpen=true,
 *            with a dark backdrop overlay. Closed via onClose.
 */

import Link            from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Brain, LayoutDashboard, BookOpen,
  LogOut, Github, Trophy, X, Flame,
} from 'lucide-react';

// ─── Nav items ────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen,        label: 'Problems',  href: '/problems'  },
];

interface SidebarProps {
  isOpen:  boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName    = session?.user?.name  ?? 'User';
  const userEmail   = session?.user?.email ?? '';
  const userInitial = userName.charAt(0).toUpperCase();

  // ── Live quick stats ─────────────────────────────────────────
  const [stats, setStats] = useState({ streak: 0, thisWeekSolved: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch('/api/user/stats')
      .then(r => r.json())
      .then(json => {
        if (json.success) setStats(json.data);
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, [session?.user?.id]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Shared inner panel ──────────────────────────────────────
  const panel = (
    <aside className="w-60 h-full bg-[#0D1117] border-r border-[#1E2740] flex flex-col">

      {/* ── Logo + mobile close ───────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#1E2740] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Brain size={15} className="text-white" />
          </div>
          <span className="font-bold text-[#F1F5F9] text-lg tracking-tight">AlgoVault</span>
        </div>

        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#475569] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-[.15em] px-3 mb-3">
          Menu
        </p>

        <ul className="space-y-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}           /* auto-close on mobile nav */
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group
                    ${active
                      ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/10 text-[#818CF8] border border-[#6366F1]/20'
                      : 'text-[#94A3B8] hover:bg-[#131A2B] hover:text-[#F1F5F9] border border-transparent'
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className={active ? 'text-[#6366F1]' : 'group-hover:text-[#6366F1] transition-colors'}
                  />
                  <span className="flex-1">{label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="h-px bg-[#1E2740] my-5" />

        {/* Quick stats */}
        <div className="mx-1 rounded-xl bg-[#131A2B] border border-[#1E2740] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={13} className="text-[#F59E0B]" />
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Quick Stats
            </p>
          </div>

          {/* Day streak */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#475569]">Day streak</span>
            {statsLoading ? (
              <div className="h-3 w-8 bg-[#1E2740] rounded animate-pulse" />
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#F1F5F9]">
                {stats.streak}
                <Flame
                  size={13}
                  className={stats.streak > 0 ? 'text-[#F97316]' : 'text-[#475569]'}
                  fill={stats.streak > 0 ? '#F97316' : 'none'}
                />
              </span>
            )}
          </div>

          {/* This week */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#475569]">This week</span>
            {statsLoading ? (
              <div className="h-3 w-6 bg-[#1E2740] rounded animate-pulse" />
            ) : (
              <span className="text-xs font-semibold text-[#F1F5F9]">
                {stats.thisWeekSolved}
                <span className="text-[#475569] font-normal ml-1">solved</span>
              </span>
            )}
          </div>
        </div>

        {/* GitHub */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 mt-3 rounded-xl text-sm text-[#475569] hover:bg-[#131A2B] hover:text-[#94A3B8] transition-all border border-transparent"
        >
          <Github size={16} />
          GitHub
        </a>
      </nav>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="shrink-0 p-3 border-t border-[#1E2740]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#F1F5F9] truncate">{userName}</p>
            <p className="text-[10px] text-[#475569] truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#475569]
                     hover:text-[#EF4444] hover:bg-[#EF4444]/8 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: always-visible fixed panel ────────────── */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        {panel}
      </div>

      {/* ── Mobile: off-canvas drawer ───────────────────────── */}
      {/* Backdrop */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          lg:hidden fixed left-0 top-0 h-screen z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {panel}
      </div>
    </>
  );
}