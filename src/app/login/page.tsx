'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import BinIshaqLogo from '@/components/common/BinIshaqLogo';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';
  const { showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Set client session
      if (typeof window !== 'undefined') {
        const cleanName = email.includes('@') ? email.split('@')[0] : email;
        const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            email,
            name: displayName,
            role: 'client',
            loginTime: new Date().toISOString(),
          })
        );
      }
      setLoading(false);
      showToast('Welcome back to Bin Ishaq Properties!');
      window.location.href = redirectTarget;
    }, 500);
  };


  return (
    <div className="min-h-[calc(100vh-140px)] min-h-[calc(100svh-140px)] bg-[#FAF8F3] flex flex-col justify-center py-4 sm:py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex justify-center mb-3 sm:mb-5">
          <BinIshaqLogo size="md" variant="dark" />
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900">
          Client Portal Sign In
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          Sign in to list properties, manage submissions, and access verified society portfolios.
        </p>
      </div>

      <div className="mt-4 sm:mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200 py-6 sm:py-8 px-5 sm:px-10 shadow-sm rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address / Client ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="yourname@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-xs text-slate-500 hover:text-black font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1320] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Don&apos;t have an investor account?{' '}
            <Link
              href={`/signup${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
              className="text-black font-bold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Client Portal • Official Society Transfer Desk</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
