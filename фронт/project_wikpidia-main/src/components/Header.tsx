"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // імпорт хука безпеки

export default function Header() {
    const { user, logout, loading } = useAuth(); // отримуємо глобальний стан авторизації
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleNavigationSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}&type=articles`);
        } else {
            router.push("/search");
        }
    };

    if (!isMounted) {
        return <div className="h-14 bg-white border-b border-dark-color-bar/20 sticky top-0 z-50" />;
    }

    return (
        <header className="flex items-center justify-between px-6 py-2 bg-white border-b border-dark-color-bar/20 sticky top-0 z-50">

            {/* ЛОГОТИП І НАЗВА */}
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo_blue.svg" alt="logo" className="w-10 h-10 object-contain" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-website-name font-serif font-bold italic text-lg">Онлайн-</span>
                        <span className="text-website-name font-serif font-bold italic text-lg -mt-1">енциклопедія КПІ</span>
                    </div>
                </Link>
            </div>

            {/* ПАНЕЛЬ ПОШУКУ */}
            <form onSubmit={handleNavigationSearch} className="flex-grow max-w-md mx-4">
                <div className="flex h-9 shadow-sm border border-dark-color-bar/30 rounded-sm overflow-hidden bg-light-color-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Шукати..."
                        className="flex-grow px-3 bg-transparent text-main-text text-sm outline-none font-serif italic"
                    />
                    <button type="submit" className="bg-search-button hover:bg-website-name px-4 transition-colors text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* ДИНАМІЧНА СЕКЦІЯ АВТЕНТИФІКАЦІЇ */}
            <div className="flex items-center gap-4 text-sm font-serif">
                {loading ? (
                    <span className="text-gray-300 italic text-xs">Перевірка сесії...</span>
                ) : user ? (
                    /* ЯКЩО КОРИСТУВАЧ УВІЙШОВ — показуємо його профільні дані */
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex items-center gap-2 group">
                            <div className="bg-search-button text-white font-bold w-7 h-7 rounded-full flex items-center justify-center uppercase text-xs">
                                {user.username ? user.username[0] : "U"}
                            </div>
                            <span className="text-website-name font-bold italic hover:underline">
                                @{user.username}
                            </span>
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={logout}
                            className="text-[#A01E36] hover:underline italic font-bold cursor-pointer text-xs uppercase tracking-wider"
                        >
                            Вийти
                        </button>
                    </div>
                ) : (
                    /* ЯКЩО НЕ УВІЙШОВ — залишаємо ваші стандартні посилання */
                    <>
                        <Link href="/register" className="text-website-links hover:underline italic">Реєстрація</Link>
                        <span className="text-gray-300">/</span>
                        <Link href="/login" className="text-website-links hover:underline italic">Зайти в кабінет</Link>
                    </>
                )}
            </div>

        </header>
    );
}