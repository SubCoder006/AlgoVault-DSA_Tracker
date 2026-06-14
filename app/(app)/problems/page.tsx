'use client';

/**
 * Problems Page  (route: /problems)
 * The main problem bank. Shows FilterBar, grid/list of ProblemCards,
 * skeleton loading state, error state, empty state, and Add/Edit modal.
 */

import { useState }     from 'react';
import { Plus, LayoutGrid, List, AlertCircle } from 'lucide-react';
import { useProblems }  from '@/context/ProblemsContext';
import ProblemCard      from '@/components/problems/ProblemCard';
import ProblemForm      from '@/components/problems/ProblemForm';
import FilterBar        from '@/components/problems/FilterBar';
import { SkeletonCardGrid } from '@/components/ui/LoadingSkeleton';
import { Problem, ProblemFormData } from '@/types';

export default function ProblemsPage() {
  const {
    filteredProblems, filters, setFilters,
    addProblem, updateProblem,
    isLoading, error, refetch,
  } = useProblems();

  const [isFormOpen,      setIsFormOpen    ] = useState(false);
  const [editingProblem,  setEditingProblem] = useState<Problem | null>(null);
  const [viewMode,        setViewMode      ] = useState<'grid' | 'list'>('grid');
  const [formError,       setFormError     ] = useState<string | null>(null);

  // ─── Handlers ────────────────────────────────────────────────

  const openAdd  = ()              => { setEditingProblem(null); setFormError(null); setIsFormOpen(true); };
  const openEdit = (p: Problem)    => { setEditingProblem(p);    setFormError(null); setIsFormOpen(true); };
  const handleClose = ()           => { setIsFormOpen(false); setEditingProblem(null); };

  const handleSave = async (data: ProblemFormData) => {
    try {
      if (editingProblem) {
        await updateProblem(editingProblem.id, data);
      } else {
        await addProblem(data);
      }
      handleClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save problem.');
    }
  };

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F1F5F9]">Problem Bank</h1>
          <p className="text-sm text-[#475569] mt-0.5">Track and organise your DSA problems</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid / list toggle */}
          <div className="hidden sm:flex items-center bg-[#131A2B] border border-[#1E2740] rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#6366F1] text-white' : 'text-[#475569] hover:text-[#94A3B8]'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#6366F1] text-white' : 'text-[#475569] hover:text-[#94A3B8]'}`}
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={openAdd}
            className="btn-glow flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl"
          >
            <Plus size={16} />
            Add Problem
          </button>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        resultCount={filteredProblems.length}
      />

      {/* ── API error state ──────────────────────────────────── */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-[#EF4444]" />
          </div>
          <h3 className="text-base font-semibold text-[#F1F5F9] mb-1">Failed to load problems</h3>
          <p className="text-sm text-[#475569] mb-5 max-w-xs">{error}</p>
          <button
            onClick={refetch}
            className="btn-glow px-4 py-2 text-sm text-white font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────── */}
      {isLoading && <SkeletonCardGrid count={8} />}

      {/* ── Empty state ──────────────────────────────────────── */}
      {!isLoading && !error && filteredProblems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#131A2B] border border-[#1E2740] flex items-center justify-center mb-4">
            <Plus size={24} className="text-[#475569]" />
          </div>
          <h3 className="text-base font-semibold text-[#94A3B8] mb-1">No problems found</h3>
          <p className="text-sm text-[#475569] max-w-xs mb-5">
            {filters.search || filters.platform !== 'All' || filters.difficulty !== 'All' || filters.status !== 'All'
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Start building your problem bank — add your first DSA problem now.'}
          </p>
          <button
            onClick={openAdd}
            className="btn-glow flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl"
          >
            <Plus size={15} />
            Add First Problem
          </button>
        </div>
      )}

      {/* ── Grid view ────────────────────────────────────────── */}
      {!isLoading && !error && filteredProblems.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProblems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* ── List view ────────────────────────────────────────── */}
      {!isLoading && !error && filteredProblems.length > 0 && viewMode === 'list' && (
        <div className="card overflow-hidden">
          <div className="divide-y divide-[#1E2740]">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} onEdit={openEdit} listMode />
            ))}
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ─────────────────────────────────── */}
      <ProblemForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSave={handleSave}
        editingProblem={editingProblem}
        serverError={formError}
      />
    </div>
  );
}