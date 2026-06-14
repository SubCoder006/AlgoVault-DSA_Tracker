'use client';

/**
 * Navbar component
 * Sticky top bar with:
 *  - Hamburger button (mobile only) — triggers sidebar drawer via onMenuClick
 *  - Page title
 *  - Search input — wired live to ProblemsContext filter when on /problems;
 *    on other pages it navigates to /problems then applies the search.
 *  - Notification bell + user dropdown
 */

import { useState }    from 'react';
import Link            from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut }    from 'next-auth/react';
import {
  Bell, Search, User, ChevronDown,
  X, LogOut, Settings, Menu,
} from 'lucide-react';
import { useProblems } from '@/context/ProblemsContext';

interface NavbarProps {
  title?:       string;
  onMenuClick?: () => void;   // toggles the mobile sidebar drawer
}

export default function Navbar({ title = 'Dashboard', onMenuClick }: NavbarProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const { filters, setFilters } = useProblems();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Derive display values from the real session
  const userName   = session?.user?.name  ?? 'User';
  const userEmail  = session?.user?.email ?? '';
  const userInitial = userName.charAt(0).toUpperCase();

  // ── Search helpers ────────────────────────────────────────────
  const onProblemsPage = pathname === '/problems';

  // The visible search value comes straight from the shared filter state
  const searchVal = filters.search;

  const handleSearch = (val: string) => {
    // Always update the filter (no-op if not on /problems, but harmless)
    setFilters({ ...filters, search: val });

    // If the user is searching from a different page, jump to /problems
    if (!onProblemsPage && val.length > 0) {
      router.push('/problems');
    }
  };

  const clearSearch = () => setFilters({ ...filters, search: '' });

  // ─────────────────────────────────────────────────────────────

  return (
    <header className="h-16 border-b border-[#1E2740] bg-[#070B14]/85 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 sm:px-6 justify-between gap-3">

      {/* ── Left: hamburger (mobile) + page title ────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Hamburger — hidden on lg+ where sidebar is always visible */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-[#F1F5F9] font-semibold text-base">{title}</h1>
      </div>

      {/* ── Centre: search bar (wired to ProblemsContext) ─────── */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs bg-[#131A2B] border border-[#1E2740] rounded-lg px-3 py-2 focus-within:border-[#6366F1]/40 transition-colors">
        <Search size={14} className="text-[#475569] shrink-0" />
        <input
          type="text"
          value={searchVal}
          onChange={e => handleSearch(e.target.value)}
          placeholder={onProblemsPage ? 'Search problems…' : 'Search problems…'}
          className="bg-transparent text-sm text-[#94A3B8] placeholder:text-[#475569] outline-none w-full"
        />
        {searchVal && (
          <button onClick={clearSearch} aria-label="Clear search">
            <X size={13} className="text-[#475569] hover:text-[#94A3B8] transition-colors" />
          </button>
        )}
      </div>

      {/* ── Right: actions ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Mobile search icon — tapping could expand a full-width bar
            For now it just navigates to /problems for simplicity */}
        <button
          onClick={() => router.push('/problems')}
          className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
        </button>

        {/* User pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2 bg-[#131A2B] border border-[#1E2740] rounded-lg px-2.5 py-2 hover:border-[#6366F1]/40 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shrink-0 text-white text-xs font-bold">
              {userInitial}
            </div>
            <span className="text-sm text-[#F1F5F9] hidden sm:block font-medium">{userName.split(' ')[0]}</span>
            <ChevronDown
              size={13}
              className={`text-[#94A3B8] transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-[#0D1117] border border-[#1E2740] rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 border-b border-[#1E2740]">
                  <p className="text-xs font-semibold text-[#F1F5F9]">{userName}</p>
                  <p className="text-[10px] text-[#475569] mt-0.5 truncate">{userEmail}</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#131A2B] hover:text-[#F1F5F9] rounded-lg transition-all">
                    <Settings size={14} /> Settings
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] rounded-lg transition-all"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}