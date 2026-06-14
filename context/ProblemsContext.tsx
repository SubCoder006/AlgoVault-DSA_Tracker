'use client';

/**
 * ProblemsContext
 * Global state for the problem bank.
 * All CRUD operations hit the real /api/problems endpoints.
 * Client-side filtering is applied on top of the fetched list
 * so the UI stays snappy without extra round-trips.
 */

import React, {
  createContext, useContext, useState,
  useEffect, useMemo, useCallback, ReactNode,
} from 'react';
import { Problem, FilterState, ProblemFormData } from '@/types';

// ─── Context shape ────────────────────────────────────────────

interface ProblemsContextType {
  problems:         Problem[];
  filteredProblems: Problem[];
  filters:          FilterState;
  isLoading:        boolean;
  error:            string | null;
  setFilters:       (f: FilterState) => void;
  addProblem:       (data: ProblemFormData) => Promise<void>;
  updateProblem:    (id: string, data: ProblemFormData) => Promise<void>;
  deleteProblem:    (id: string) => Promise<void>;
  refetch:          () => Promise<void>;
}

// ─── Default filter state ─────────────────────────────────────

const defaultFilters: FilterState = {
  search:     '',
  platform:   'All',
  difficulty: 'All',
  status:     'All',
  tag:        '',
};

// ─── Helper: convert MongoDB doc (_id) to frontend Problem (id) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseProblem(doc: any): Problem {
  return {
    id:         doc._id ?? doc.id,
    title:      doc.title,
    platform:   doc.platform,
    link:       doc.link ?? '',
    difficulty: doc.difficulty,
    status:     doc.status,
    tags:       doc.tags ?? [],
    notes:      doc.notes ?? '',
    mistakes:   doc.mistakes ?? '',
    createdAt:  typeof doc.createdAt === 'string'
      ? doc.createdAt.split('T')[0]
      : new Date(doc.createdAt).toISOString().split('T')[0],
  };
}

// ─── Context ─────────────────────────────────────────────────

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────

export function ProblemsProvider({ children }: { children: ReactNode }) {
  const [problems,  setProblems ] = useState<Problem[]>([]);
  const [filters,   setFilters  ] = useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError    ] = useState<string | null>(null);

  // ── Fetch all problems from the API ───────────────────────
  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/problems');
      if (!res.ok) throw new Error('Failed to load problems.');
      const json = await res.json();
      setProblems((json.data ?? []).map(normaliseProblem));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  // ── Add ──────────────────────────────────────────────────
  const addProblem = useCallback(async (data: ProblemFormData) => {
    const res = await fetch('/api/problems', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? 'Failed to add problem.');
    }
    const json = await res.json();
    setProblems(prev => [normaliseProblem(json.data), ...prev]);
  }, []);

  // ── Update ───────────────────────────────────────────────
  const updateProblem = useCallback(async (id: string, data: ProblemFormData) => {
    const res = await fetch(`/api/problems/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? 'Failed to update problem.');
    }
    const json = await res.json();
    setProblems(prev =>
      prev.map(p => p.id === id ? normaliseProblem(json.data) : p)
    );
  }, []);

  // ── Delete ───────────────────────────────────────────────
  const deleteProblem = useCallback(async (id: string) => {
    const res = await fetch(`/api/problems/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? 'Failed to delete problem.');
    }
    setProblems(prev => prev.filter(p => p.id !== id));
  }, []);

  // ── Client-side filtering (no extra round-trips) ─────────
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const search = filters.search.toLowerCase();
      if (search && !p.title.toLowerCase().includes(search)) return false;
      if (filters.platform   !== 'All' && p.platform   !== filters.platform)   return false;
      if (filters.difficulty !== 'All' && p.difficulty !== filters.difficulty) return false;
      if (filters.status     !== 'All' && p.status     !== filters.status)     return false;
      if (filters.tag && !p.tags.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()))) return false;
      return true;
    });
  }, [problems, filters]);

  return (
    <ProblemsContext.Provider value={{
      problems,
      filteredProblems,
      filters,
      isLoading,
      error,
      setFilters,
      addProblem,
      updateProblem,
      deleteProblem,
      refetch: fetchProblems,
    }}>
      {children}
    </ProblemsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────

export function useProblems() {
  const ctx = useContext(ProblemsContext);
  if (!ctx) throw new Error('useProblems must be used inside <ProblemsProvider>');
  return ctx;
}