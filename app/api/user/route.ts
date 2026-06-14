import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import { connectDB }        from '@/lib/mongoose';
import User                 from '@/models/User';
import { apiSuccess, apiError, unauthorized } from '@/lib/api-helpers';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();
    await connectDB();
    const user = await User.findById(session.user.id).select('-password').lean();
    if (!user) return unauthorized();
    return apiSuccess({ id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    console.error(err);
    return apiError('Failed to fetch user profile.');
  }
}