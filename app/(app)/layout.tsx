'use client';

/**
 * App Layout  (wraps /dashboard and /problems)
 * Renders the fixed sidebar + sticky navbar around the page content.
 * Manages sidebar open/close state for mobile hamburger behaviour.
 * Also mounts the ProblemsProvider so all nested pages share state.
 */

import { useState, useEffect } from 'react';
import { usePathname }         from 'next/navigation';
import Sidebar                 from '@/components/layout/Sidebar';
import Navbar                  from '@/components/layout/Navbar';
import { ProblemsProvider }    from '@/context/ProblemsContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/problems':  'Problems',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title    = PAGE_TITLES[pathname] ?? 'AlgoVault';

  // Controls the mobile drawer — desktop sidebar is always visible via CSS
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-close drawer whenever the route changes (user tapped a nav link)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  return (
    <ProblemsProvider>
      <div className="min-h-screen bg-[#070B14] flex">

        {/* Sidebar — drawer on mobile, fixed panel on lg+ */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content column
            On mobile: full width (sidebar overlays)
            On lg+: offset by sidebar width */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
          <Navbar
            title={title}
            onMenuClick={() => setSidebarOpen(v => !v)}
          />

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProblemsProvider>
  );
}