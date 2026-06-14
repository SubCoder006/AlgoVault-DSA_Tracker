import { NextRequest }  from 'next/server';
import bcrypt           from 'bcryptjs';
import { connectDB }    from '@/lib/mongoose';
import User             from '@/models/User';
import { apiSuccess, apiError, badRequest } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name?.trim())               return badRequest('Name is required.');
    if (!email?.trim())              return badRequest('Email is required.');
    if (!/\S+@\S+\.\S+/.test(email)) return badRequest('Enter a valid email address.');
    if (!password || password.length < 6) return badRequest('Password must be at least 6 characters.');

    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) return apiError('An account with this email already exists.', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });
    return apiSuccess({ id: user._id.toString(), name: user.name, email: user.email }, 201);
  } catch (err) {
    console.error('[Signup Error]', err);
    return apiError('Something went wrong. Please try again.');
  }
}