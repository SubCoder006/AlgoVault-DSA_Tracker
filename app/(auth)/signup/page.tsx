'use client';

/**
 * Signup Page  (route: /signup)
 * Calls POST /api/auth/signup to create the account,
 * then immediately signs in via NextAuth credentials.
 */

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { signIn }      from 'next-auth/react';
import Link            from 'next/link';
import { Brain, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

const perks = [
  'Track problems across all platforms',
  'Spot weak areas automatically',
  'Flag problems for smart revision',
];

export default function SignupPage() {
  const router = useRouter();

  const [form,      setForm    ] = useState({ name: '', email: '', password: '' });
  const [errors,    setErrors  ] = useState<Record<string, string>>({});
  const [showPass,  setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                       e.name     = 'Name is required';
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

    try {
      // 1. Create account
      const res = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrors({ email: json.error ?? 'Failed to create account.' });
        setIsLoading(false);
        return;
      }

      // 2. Sign in immediately with the new credentials
      const result = await signIn('credentials', {
        redirect:  false,
        email:     form.email,
        password:  form.password,
      });

      if (result?.error) {
        setErrors({ password: 'Account created but sign-in failed. Try logging in.' });
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = (name: string) =>
    `input-base${errors[name] ? ' input-error' : ''}`;

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/7 rounded-full blur-[120px]" />
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
          <h1 className="text-2xl font-bold text-[#F1F5F9] mt-7 mb-1">Create your account</h1>
          <p className="text-sm text-[#94A3B8]">Start tracking your DSA progress today</p>
        </div>

        {/* Perks */}
        <div className="flex flex-col gap-1.5 mb-6">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <CheckCircle2 size={13} className="text-[#6366F1] shrink-0" />
              {p}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                placeholder="Alex Johnson"
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                className={fieldClass('name')}
              />
              {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
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
                  placeholder="Min. 6 characters"
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
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

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        form.password.length >= i * 4
                          ? i === 1 ? 'bg-[#EF4444]' : i === 2 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                          : 'bg-[#1E2740]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-glow w-full mt-6 py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account…' : (<>Create Account <ArrowRight size={16} /></>)}
          </button>

          <p className="text-center text-sm text-[#475569] mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}