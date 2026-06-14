// ─── Core domain types ────────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status     = 'Solved' | 'Unsolved' | 'Revision';
export type Platform   = 'LeetCode' | 'GeeksForGeeks' | 'HackerRank' | 'CodeForces' | 'Other';

export interface Problem {
  id:         string;
  title:      string;
  platform:   Platform;
  link:       string;
  difficulty: Difficulty;
  status:     Status;
  tags:       string[];
  notes:      string;
  mistakes:   string;
  createdAt:  string; // ISO date string YYYY-MM-DD
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface FilterState {
  search:     string;
  platform:   string;
  difficulty: string;
  status:     string;
  tag:        string;
}

// ─── Form data (omits computed fields) ───────────────────────────────────────

export type ProblemFormData = Omit<Problem, 'id' | 'createdAt'>;
