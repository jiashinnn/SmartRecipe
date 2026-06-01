'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChefHat, ArrowRight, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tiffany/10 text-tiffany text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
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

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 w-full">
        {/* Feature 1 */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 hover:border-tiffany-200 hover:shadow-xl transition-all">
          <span className="inline-flex p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-6">
            <ChefHat className="h-6 w-6" />
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Matching</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Our intelligent recipe generator matches meals based on ingredients you have, sorting out seasonings and condiments automatically.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 hover:border-tiffany-200 hover:shadow-xl transition-all">
          <span className="inline-flex p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-6">
            <Globe className="h-6 w-6" />
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Multilingual</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Toggle seamlessly between English, Malay, and Simplified Chinese anytime with a single click. Form inputs and generated recipes match your preference.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 hover:border-tiffany-200 hover:shadow-xl transition-all">
          <span className="inline-flex p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-6">
            <Shield className="h-6 w-6" />
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Supabase Secure</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your custom pantry inventory is protected by Row Level Security (RLS). Only you can view, add, or delete your ingredients.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-20 border-t border-gray-100 pt-10 text-center w-full max-w-4xl mx-auto px-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4">Core Benefits</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <span className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-tiffany" />
            <span>Zero Food Waste</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-tiffany" />
            <span>Personalized Meal Plans</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-tiffany" />
            <span>Instant Dynamic Scaling</span>
          </span>
        </div>
      </div>
    </div>
  );
}
