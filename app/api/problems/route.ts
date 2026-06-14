import { NextRequest }  from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }  from '@/lib/auth';
import { connectDB }    from '@/lib/mongoose';
import Problem          from '@/models/Problem';
import { apiSuccess, apiError, unauthorized, badRequest } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = { userId: session.user.id };
    const status     = searchParams.get('status');
    const difficulty = searchParams.get('difficulty');
    const platform   = searchParams.get('platform');
    if (status     && status     !== 'All') filter.status     = status;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (platform   && platform   !== 'All') filter.platform   = platform;
    const problems = await Problem.find(filter).sort({ createdAt: -1 }).lean();
    return apiSuccess(problems);
  } catch (err) {
    console.error('[GET /api/problems]', err);
    return apiError('Failed to fetch problems.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    const body = await req.json();
    if (!body.title?.trim()) return badRequest('Title is required.');
    await connectDB();
    const problem = await Problem.create({
      userId:     session.user.id,
      title:      body.title.trim(),
      platform:   body.platform   ?? 'LeetCode',
      link:       body.link       ?? '',
      difficulty: body.difficulty ?? 'Medium',
      status:     body.status     ?? 'Unsolved',
      tags:       Array.isArray(body.tags) ? body.tags : [],
      notes:      body.notes    ?? '',
      mistakes:   body.mistakes ?? '',
    });
    return apiSuccess(problem, 201);
  } catch (err) {
    console.error('[POST /api/problems]', err);
    return apiError('Failed to create problem.');
  }
}