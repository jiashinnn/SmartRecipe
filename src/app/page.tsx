'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tiffany/10 text-tiffany text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <span>AI-Powered Recipe Generation</span>
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight sm:leading-none">
          Cook Smarter with <span className="text-tiffany">What You Have</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Instantly generate customized, mouth-watering recipes using the ingredients and seasonings already sitting in your kitchen pantry. Reduce waste, save money.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-tiffany hover:bg-tiffany-600 text-white font-extrabold text-lg transition-all active:scale-98 shadow-lg shadow-tiffany/20"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:border-tiffany hover:text-tiffany font-extrabold text-lg transition-all active:scale-98"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
