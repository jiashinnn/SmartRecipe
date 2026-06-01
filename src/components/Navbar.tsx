'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, LogOut, Globe, ChefHat } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const supabase = createClient();

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const navLinks = [
        { href: '/dashboard', label: t.nav.dashboard },
        { href: '/pantry', label: t.nav.pantry },
        { href: '/recipe', label: t.nav.recipes },
    ];

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ms', label: 'Melayu' },
        { code: 'zh', label: '简体中文' },
    ] as const;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-tiffany-100 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-tiffany font-bold text-xl hover:opacity-90 transition-opacity">
                        <ChefHat className="h-7 w-7 text-tiffany animate-pulse" />
                        <span>SmartRecipe</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden md:flex space-x-1">
                            {navLinks.map((link) => {
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                                ? 'bg-tiffany text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-tiffany-50 hover:text-tiffany'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Action Buttons (Language & Logout) */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:border-tiffany hover:text-tiffany transition-all"
                            >
                                <Globe className="h-4 w-4" />
                                <span>{languages.find(l => l.code === language)?.label}</span>
                            </button>

                            {langDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-36 bg-white border border-tiffany-100 rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code
                                                    ? 'bg-tiffany-50 text-tiffany font-semibold'
                                                    : 'text-gray-700 hover:bg-tiffany-50'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-500 font-medium text-sm transition-all cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t.nav.logout}</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg bg-tiffany hover:bg-tiffany-600 text-white font-medium text-sm transition-all"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Quick Language Toggle Icon for Mobile */}
                        <button
                            onClick={() => {
                                const nextLangMap: Record<string, 'en' | 'ms' | 'zh'> = { en: 'ms', ms: 'zh', zh: 'en' };
                                setLanguage(nextLangMap[language]);
                            }}
                            className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:text-tiffany hover:bg-tiffany-50 active:scale-95 transition-all"
                            title="Change Language"
                        >
                            <Globe className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-tiffany-50 hover:text-tiffany focus:outline-none transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden bg-white/95 border-b border-tiffany-100 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-300">
                    {user && navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${isActive
                                        ? 'bg-tiffany text-white'
                                        : 'text-gray-700 hover:bg-tiffany-50 hover:text-tiffany'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    <div className="pt-4 border-t border-gray-100">
                        {user ? (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>{t.nav.logout}</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block text-center w-full px-4 py-3 rounded-xl bg-tiffany text-white font-bold hover:bg-tiffany-600 transition-colors"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
