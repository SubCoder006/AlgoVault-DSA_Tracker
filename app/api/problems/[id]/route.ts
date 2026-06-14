import { NextRequest }       from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/lib/auth';
import { connectDB }         from '@/lib/mongoose';
import Problem               from '@/models/Problem';
import { apiSuccess, apiError, unauthorized, notFound, badRequest } from '@/lib/api-helpers';

async function resolveOwned(id: string, userId: string) {
  const problem = await Problem.findById(id).lean();
  if (!problem)                             return { error: notFound('Problem not found.') };
  if (problem.userId.toString() !== userId) return { error: unauthorized() };
  return { problem };
}

// ── Next.js 15: params is a Promise — must be awaited ─────────
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;                          // ← await here
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    await connectDB();
    const { problem, error } = await resolveOwned(id, session.user.id);
    if (error) return error;
    return apiSuccess(problem);
  } catch (err) {
    console.error('[GET /api/problems/:id]', err);
    return apiError('Failed to fetch problem.');
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;                          // ← await here
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    const body = await req.json();
    if (!body.title?.trim()) return badRequest('Title is required.');
    await connectDB();
    const { error } = await resolveOwned(id, session.user.id);
    if (error) return error;
    const allowed = ['title','platform','link','difficulty','status','tags','notes','mistakes'];
    const update: Record<string, unknown> = {};
    for (const f of allowed) { if (body[f] !== undefined) update[f] = body[f]; }
    const updated = await Problem.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
    return apiSuccess(updated);
  } catch (err) {
    console.error('[PUT /api/problems/:id]', err);
    return apiError('Failed to update problem.');
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;                          // ← await here
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    await connectDB();
    const { error } = await resolveOwned(id, session.user.id);
    if (error) return error;
    await Problem.findByIdAndDelete(id);
    return apiSuccess({ message: 'Problem deleted successfully.' });
  } catch (err) {
    console.error('[DELETE /api/problems/:id]', err);
    return apiError('Failed to delete problem.');
  }
}