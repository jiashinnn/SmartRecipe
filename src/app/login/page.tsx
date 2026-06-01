'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChefHat, Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 sm:py-16 px-4">
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:border-tiffany-100 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-3">
            <ChefHat className="h-8 w-8 animate-pulse" />
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm mt-1.5">
            {isSignUp ? 'Sign up to start scanning your kitchen' : 'Sign in to access your custom recipes'}
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-base py-3 pl-10 pr-4 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-tiffany focus:ring-2 focus:ring-tiffany/20 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-base py-3 pl-10 pr-4 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-tiffany focus:ring-2 focus:ring-tiffany/20 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-tiffany hover:bg-tiffany-600 disabled:opacity-50 text-white font-extrabold text-base transition-all active:scale-98 cursor-pointer mt-2 shadow-lg shadow-tiffany/10"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
              setErrorMsg(null);
            }}
            className="text-tiffany hover:text-tiffany-600 font-bold text-sm transition-colors cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
