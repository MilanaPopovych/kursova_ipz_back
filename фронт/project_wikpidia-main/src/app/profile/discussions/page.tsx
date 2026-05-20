"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // ІМПОРТ КОНТЕКСТУ БЕЗПЕКИ

export default function MyDiscussionsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    // Отримуємо глобальний стан авторизації
    const { token, loading: authLoading } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // запит до spring boot api з передачею токена
    useEffect(() => {
        if (!isMounted) return;
        // токена немає = користувач не авторизований
        if (!authLoading && !token) {
            setError("Авторизуйтеся для перегляду ваших обговорень.");
            setLoading(false);
            router.push('/login');
            return;
        }

        if (!token) return;

        setLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        fetch(`${baseUrl}/api/users/discussions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // передаємо токен у форматі Bearer для Spring Security Guard
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 401 || res.status === 403) {
                    throw new Error('Ваша сесія застаріла. Будь ласка, увійдіть в акаунт знову.');
                }
                if (!res.ok) throw new Error('Не вдалося завантажити історію обговорень з бази даних.');
                return res.json();
            })
            .then((data: any) => {
                setDiscussions(data || []);
            })
            .catch((err: any) => {
                console.error("Discussions fetch error:", err);
                setError(err.message || "Сервер не відповідає. Перевірте підключення до PostgreSQL/Spring Boot.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isMounted, token, authLoading, router]);

    if (!isMounted) return null;
    // фільтрація обговорень
    const filteredDiscussions = discussions.filter((disc: any) =>
        disc.articleTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disc.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disc.comment?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 space-y-6 overflow-hidden">
                    {/* кнопка швидкого повернення на профіль */}
                    <div className="mb-2">
                        <Link
                            href="/profile"
                            className="text-website-name hover:text-website-links font-bold italic flex items-center gap-2 group"
                        >
                            <span className="transform group-hover:-translate-x-1 transition-transform"> ← </span>
                            Повернутися до особистого кабінету
                        </Link>
                    </div>
                    {/* головний заголовок сторінки */}
                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center gap-4">
                        <div className="bg-white text-search-button p-2 rounded-full text-xl w-10 h-10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5" fill="currentColor">
                                <path d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold italic">Мої обговорення</h1>
                            <p className="text-white/80 text-sm italic">Історія ваших дискусій на WiKPIdia</p>
                        </div>
                    </div>
                    {/* інструмент пошуку по коментарях */}
                    <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-2xs">
                        <div className="p-4 bg-brand-border/10">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                placeholder="Фільтрувати обговорення за ключовими словами або назвою статті..."
                                className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/40"
                            />
                        </div>
                    </div>
                    {/* завантаження */}
                    {(loading || authLoading) && (
                        <div className="text-center py-12 font-serif italic text-main-text animate-pulse">
                            Отримання історії коментарів...
                        </div>
                    )}
                    {/* помилка зв'язку */}
                    {!loading && !authLoading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-sm font-serif italic text-[#A01E36]">
                            {error}
                        </div>
                    )}
                    {/* стрічка обговорень */}
                    {!loading && !authLoading && !error && (
                        <div className="space-y-4">
                            {filteredDiscussions.length > 0 ? (
                                filteredDiscussions.map((disc: any) => {
                                    // обчислення slug статті (якщо бекенд надав готовий slug, берем його. Якщо ні — генеруємо автоматично з назви)
                                    const articleTargetSlug = disc.articleSlug || (disc.articleTitle ? encodeURIComponent(disc.articleTitle.trim().toLowerCase().replace(/\s+/g, '-')) : "");

                                    // відображення дати
                                    const formattedDate = disc.createdAt ? new Date(disc.createdAt).toLocaleDateString('uk-UA') : (disc.date || "Не вказано");

                                    return (
                                        <div
                                            key={disc.id}
                                            className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-2xs"
                                        >
                                            {/* Шапка картки дискусії з посиланнями на статтю */}
                                            <div className="bg-dark-color-bar px-4 py-2 text-white text-sm font-bold flex flex-wrap justify-between items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/70">Стаття:</span>
                                                    <Link
                                                        href={`/article/${articleTargetSlug}`}
                                                        className="text-white hover:underline italic font-serif text-[15px]"
                                                    >
                                                        «{disc.articleTitle || "Без назви"}»
                                                    </Link>
                                                </div>
                                                <span className="text-[12px] text-white/80 font-mono shrink-0">
                                                    Дата: {formattedDate}
                                                </span>
                                            </div>

                                            {/* Вміст картки коментаря */}
                                            <div className="p-4 bg-brand-border/5 space-y-2">
                                                <div className="text-sm text-website-name font-bold italic">
                                                    Тема: <span className="text-main-text not-italic font-normal">{disc.topic || "Загальне обговорення"}</span>
                                                </div>
                                                <div className="p-3 bg-white border border-dark-color-bar/10 rounded-xs text-sm italic text-main-text leading-relaxed relative">
                                                    <span className="text-2xl text-search-button/20 font-serif absolute -top-2 left-1">“</span>
                                                    <p className="pl-4 text-gray-700">{disc.comment || disc.content}</p>
                                                </div>

                                                {/* Кнопка переходу безпосередньо до гілки обговорень на сторінці статті */}
                                                <div className="text-right pt-1">
                                                    <Link
                                                        href={`/article/${articleTargetSlug}/discussion`}
                                                        className="text-[11px] text-website-links hover:underline italic font-bold uppercase tracking-wider"
                                                    >
                                                        Перейти до повної гілки обговорення →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 border border-dashed border-dark-color-bar/20 bg-brand-border/5 rounded-sm">
                                    <p className="text-gray-400 text-sm italic">Ви ще не брали участі в обговореннях статей.</p>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}