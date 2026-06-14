'use client';

/**
 * ProblemForm component
 * Modal overlay used for both adding and editing a problem.
 * Resets to the editing problem's values when opened in edit mode,
 * or to blank defaults when adding. Tag input supports Enter-to-add.
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Tag, Loader2 } from 'lucide-react';
import { Problem, ProblemFormData, Difficulty, Status, Platform } from '@/types';

// ─── Constants ────────────────────────────────────────────────

const PLATFORMS:    Platform[]   = ['LeetCode', 'GeeksForGeeks', 'HackerRank', 'CodeForces', 'Other'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const STATUSES:     Status[]     = ['Solved', 'Unsolved', 'Revision'];

const DEFAULT_FORM: ProblemFormData = {
  title:      '',
  platform:   'LeetCode',
  link:       '',
  difficulty: 'Medium',
  status:     'Unsolved',
  tags:       [],
  notes:      '',
  mistakes:   '',
};

// Difficulty colour accents for the toggle buttons
const DIFF_ACTIVE: Record<Difficulty, string> = {
  Easy:   'bg-[#22C55E]/20 border-[#22C55E]/40 text-[#22C55E]',
  Medium: 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]',
  Hard:   'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]',
};

const STATUS_ACTIVE: Record<Status, string> = {
  Solved:   'bg-[#22C55E]/20 border-[#22C55E]/40 text-[#22C55E]',
  Unsolved: 'bg-[#475569]/20 border-[#475569]/40 text-[#94A3B8]',
  Revision: 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]',
};

// ─── Props ────────────────────────────────────────────────────

interface ProblemFormProps {
  isOpen:          boolean;
  onClose:         () => void;
  onSave:          (data: ProblemFormData) => Promise<void>;
  editingProblem?: Problem | null;
  serverError?:    string | null;   // error from the API passed down by the page
}

// ─── Label helper ─────────────────────────────────────────────

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
      {children}
      {optional && <span className="text-[#475569] font-normal ml-1">(optional)</span>}
      {!optional && <span className="text-[#EF4444] ml-0.5">*</span>}
    </label>
  );
}

// ─── Component ────────────────────────────────────────────────

export default function ProblemForm({
  isOpen,
  onClose,
  onSave,
  editingProblem,
  serverError,
}: ProblemFormProps) {
  const [form,      setForm     ] = useState<ProblemFormData>(DEFAULT_FORM);
  const [tagInput,  setTagInput ] = useState('');
  const [errors,    setErrors   ] = useState<Partial<Record<keyof ProblemFormData, string>>>({});
  const [isSaving,  setIsSaving ] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      setForm(editingProblem
        ? {
            title:      editingProblem.title,
            platform:   editingProblem.platform,
            link:       editingProblem.link,
            difficulty: editingProblem.difficulty,
            status:     editingProblem.status,
            tags:       [...editingProblem.tags],
            notes:      editingProblem.notes,
            mistakes:   editingProblem.mistakes,
          }
        : DEFAULT_FORM
      );
      setErrors({});
      setTagInput('');
    }
  }, [isOpen, editingProblem]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return ()  => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // ─── Tag helpers ────────────────────────────────────────
  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  }, [tagInput, form.tags]);

  const removeTag = (tag: string) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  // ─── Validation ─────────────────────────────────────────
  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.link && !/^https?:\/\/.+/.test(form.link)) e.link = 'Must be a valid URL (https://…)';
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  };

  // ─── Submit ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 300)); // simulate save
    onSave(form);
    setIsSaving(false);
  };

  // ─── Field helpers ───────────────────────────────────────
  const set = <K extends keyof ProblemFormData>(key: K, val: ProblemFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  if (!isOpen) return null;

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg bg-[#0D1117] border border-[#1E2740] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fadeUp">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2740] shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#F1F5F9]">
              {editingProblem ? 'Edit Problem' : 'Add Problem'}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              {editingProblem ? 'Update the details below' : 'Log a new DSA problem to your bank'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#475569] hover:text-[#F1F5F9] hover:bg-[#131A2B] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <Label>Problem Title</Label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Two Sum"
              className={`input-base${errors.title ? ' input-error' : ''}`}
            />
            {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>}
          </div>

          {/* Platform + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Platform</Label>
              <select
                value={form.platform}
                onChange={e => set('platform', e.target.value as Platform)}
                className="input-base"
              >
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => set('difficulty', d)}
                    className={`flex-1 text-[10px] font-semibold py-2 rounded-lg border transition-all ${
                      form.difficulty === d
                        ? DIFF_ACTIVE[d]
                        : 'bg-[#131A2B] border-[#1E2740] text-[#475569] hover:border-[#263354]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Link */}
          <div>
            <Label optional>Problem Link</Label>
            <input
              type="url"
              value={form.link}
              onChange={e => set('link', e.target.value)}
              placeholder="https://leetcode.com/problems/…"
              className={`input-base${errors.link ? ' input-error' : ''}`}
            />
            {errors.link && <p className="text-xs text-[#EF4444] mt-1">{errors.link}</p>}
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className={`flex-1 text-xs font-semibold py-2.5 rounded-xl border transition-all ${
                    form.status === s
                      ? STATUS_ACTIVE[s]
                      : 'bg-[#131A2B] border-[#1E2740] text-[#475569] hover:border-[#263354]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label optional>Tags</Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag, then Enter"
                className="input-base"
              />
              <button
                onClick={addTag}
                className="btn-ghost px-3 rounded-lg shrink-0"
                title="Add tag"
              >
                <Plus size={16} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-[#6366F1]/10 border border-[#6366F1]/25 text-[#818CF8] rounded-full font-medium"
                  >
                    <Tag size={9} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-[#EF4444] transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label optional>Notes</Label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Key observations, approach, solution summary…"
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {/* Mistakes */}
          <div>
            <Label optional>Mistakes / Gotchas</Label>
            <textarea
              value={form.mistakes}
              onChange={e => set('mistakes', e.target.value)}
              placeholder="Common mistakes or edge cases to remember…"
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        {serverError && (
          <div className="mx-6 mb-1 px-3 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
            <p className="text-xs text-[#EF4444]">{serverError}</p>
          </div>
        )}
        <div className="shrink-0 px-6 py-4 border-t border-[#1E2740] flex gap-3">
          <button
            onClick={onClose}
            className="btn-ghost flex-1 py-2.5 text-sm font-medium rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-glow flex-1 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving
              ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
              : editingProblem ? 'Update Problem' : 'Save Problem'
            }
          </button>
        </div>
      </div>
    </div>
  );
}