/**
 * app/api/user/stats/route.ts
 *
 * GET /api/user/stats
 * Called once per sidebar mount. Does two things atomically:
 *   1. Updates the user's daily login streak in MongoDB
 *   2. Counts problems marked Solved within the current calendar week
 *
 * Streak logic:
 *   - Same day as lastActiveDate  → no change (already counted today)
 *   - Previous day                → streak + 1 (consecutive)
 *   - Any older date / never set  → reset to 1 (streak broken)
 */

import { getServerSession }              from 'next-auth';
import { authOptions }                   from '@/lib/auth';
import { connectDB }                     from '@/lib/mongoose';
import User                              from '@/models/User';
import Problem                           from '@/models/Problem';
import { apiSuccess, apiError, unauthorized } from '@/lib/api-helpers';

// ─── Helper: YYYY-MM-DD in UTC ────────────────────────────────

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();

    await connectDB();

    const today     = toDateStr(new Date());
    const yesterday = toDateStr(new Date(Date.now() - 86_400_000));

    // ── Fetch user (include streak fields) ────────────────────
    const user = await User.findById(session.user.id)
      .select('streak lastActiveDate')
      .lean() as any;

    if (!user) return unauthorized();

    const prevDate   = user.lastActiveDate ?? '';
    const prevStreak = user.streak         ?? 0;

    // ── Calculate new streak ──────────────────────────────────
    let newStreak = prevStreak;

    if (prevDate === today) {
      // Already visited today — streak unchanged
      newStreak = prevStreak;
    } else if (prevDate === yesterday) {
      // Consecutive day — extend streak
      newStreak = prevStreak + 1;
    } else {
      // First ever visit OR streak broken — start fresh
      newStreak = 1;
    }

    // ── Persist if anything changed ───────────────────────────
    if (prevDate !== today) {
      await User.findByIdAndUpdate(session.user.id, {
        streak:         newStreak,
        lastActiveDate: today,
      });
    }

    // ── Count problems Solved this calendar week ──────────────
    // "This week" = Monday 00:00 UTC → now
    const now           = new Date();
    const dayOfWeek     = now.getUTCDay();                   // 0=Sun … 6=Sat
    const daysFromMon   = (dayOfWeek + 6) % 7;              // Mon=0, Tue=1 …
    const weekStart     = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - daysFromMon);
    weekStart.setUTCHours(0, 0, 0, 0);

    const thisWeekSolved = await Problem.countDocuments({
      userId:    session.user.id,
      status:    'Solved',
      updatedAt: { $gte: weekStart },
    });

    return apiSuccess({
      streak:          newStreak,
      thisWeekSolved,
      lastActiveDate:  today,
    });

  } catch (err) {
    console.error('[GET /api/user/stats]', err);
    return apiError('Failed to fetch stats.');
  }
}