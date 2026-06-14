'use client';

/**
 * Login Page  (route: /login)
 * Uses NextAuth signIn('credentials') – real auth, no mock.
 * On error, NextAuth returns an error string we display inline.
 */

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { signIn }      from 'next-auth/react';
import Link            from 'next/link';
import { Brain, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [form,      setForm     ] = useState({ email: '', password: '' });
  const [errors,    setErrors   ] = useState<Record<string, string>>({});
  const [showPass,  setShowPass ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Client-side validation ────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email)                             e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = 'Enter a valid email address';
    if (!form.password)                          e.password = 'Password is required';
    else if (form.password.length < 6)           e.password = 'At least 6 characters required';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setErrors({});

    const result = await signIn('credentials', {
      redirect:  false,
      email:     form.email,
      password:  form.password,
    });

    setIsLoading(false);

    if (result?.error) {
      setErrors({ password: 'Invalid email or password.' });
    } else {
      router.push('/dashboard');
      router.refresh();        // refresh server components so session is available
    }
  };

  const fieldClass = (name: string) =>
    `input-base${errors[name] ? ' input-error' : ''}`;

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6366F1]/8 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative animate-fadeUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <Brain size={19} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#F1F5F9]">AlgoVault</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mt-7 mb-1">Welcome back</h1>
          <p className="text-sm text-[#94A3B8]">Sign in to continue your DSA journey</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={e => {
                  setForm(p => ({ ...p, email: e.target.value }));
                  setErrors(p => ({ ...p, email: '' }));
                }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className={fieldClass('email')}
              />
              {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  placeholder="••••••••"
                  onChange={e => {
                    setForm(p => ({ ...p, password: e.target.value }));
                    setErrors(p => ({ ...p, password: '' }));
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className={`${fieldClass('password')} pr-10`}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#EF4444] mt-1">{errors.password}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-glow w-full mt-6 py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in…' : (<>Sign In <ArrowRight size={16} /></>)}
          </button>

          <p className="text-center text-sm text-[#475569] mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}