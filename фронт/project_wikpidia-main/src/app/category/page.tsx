"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
// ДОДАНО: імпорти для авторизації та API
import { useAuth } from "@/context/AuthContext";
import { articleService } from "@/services/api";

export default function AllCategoriesPage() {
    const router = useRouter();

    // ДОДАНО: отримуємо користувача та токен
    const { user, token } = useAuth();
    // ДОДАНО: перевірка на адміна
    const isAdmin = user && (user.role === 'Адміністратор' || user.role === 'Адмін');

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);

    const fetchFilteredCategories = async (query: string, sort: string) => {
        setLoading(true);
        setError(null);
        setIsSearchPerformed(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            const response = await fetch(
                `${baseUrl}/api/categories?query=${encodeURIComponent(query)}&sort=${sort}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Не вдалося отримати відфільтрований список категорій.');
            }

            const data = await response.json();
            setCategories(data || []);
        } catch (err: any) {
            console.error("Fetch categories error:", err);
            setError("Сервер не відповідає або сталася помилка валідації.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFilteredCategories(searchTerm, sortOrder);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        setSortOrder(newSort);
        fetchFilteredCategories(searchTerm, newSort);
    };

    // ДОДАНО: Функція видалення категорії
    const handleDeleteCategory = async (categoryId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Запобігає кліку по самій картці (щоб не перекинуло на сторінку)

        if (!window.confirm("🚨 Ви впевнені, що хочете видалити цю категорію? Статті в ній не постраждають, просто відв'яжуться.")) return;

        if (!token) {
            alert("Помилка авторизації");
            return;
        }

        try {
            await articleService.deleteCategory(categoryId, token);
            // Оновлюємо список категорій без перезавантаження всієї сторінки
            fetchFilteredCategories(searchTerm, sortOrder);
        } catch (err: any) {
            alert(err.message || "Не вдалося видалити категорію");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl overflow-hidden">
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex items-center shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic tracking-wide">
                            Пошук категорій
                        </h1>
                    </div>

                    <div className="space-y-4 mb-10 pl-2">
                        <form onSubmit={handleSearchSubmit} className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                placeholder="Введіть ключові слова для пошуку категорії..."
                                className="flex-grow px-5 bg-light-color-bar text-main-text placeholder:text-main-text/40 italic outline-none text-lg border-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-search-button hover:bg-website-name transition-colors w-16 flex items-center justify-center flex-shrink-0 text-white disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
                                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                                </svg>
                            </button>
                        </form>

                        <div className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <select
                                value={sortOrder}
                                onChange={handleSortChange}
                                className="flex-grow px-4 bg-light-color-bar text-website-links italic outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Оберіть алфавітний порядок відображення...</option>
                                <option value="asc">Сортувати за алфавітом (А — Я)</option>
                                <option value="desc">Сортувати за алфавітом (Я — А)</option>
                            </select>
                            <div className="bg-search-button w-16 flex items-center justify-center flex-shrink-0 pointer-events-none text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v10.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {!isSearchPerformed && (
                        <div className="mt-12 p-8 border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/5">
                            <p className="text-main-text/60 italic text-center text-lg leading-relaxed">
                                Категорії знань не завантажуються автоматично для економії ресурсів ІС. <br/>
                                <span className="text-website-name font-bold">Оберіть алфавітний порядок</span> або введіть текст вище для пошуку.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8 italic text-main-text animate-pulse">
                            Сортування та фільтрація глобальних категорій у базі PostgreSQL...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-sm font-serif italic text-[#A01E36]">
                            {error}
                        </div>
                    )}

                    {!loading && !error && isSearchPerformed && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-website-name text-lg font-bold italic border-b border-dark-color-bar/20 pb-2 uppercase mb-6">
                                Знайдені категорії знань ({categories.length}):
                            </h2>

                            {categories.length === 0 ? (
                                <div className="py-10 text-center border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/10">
                                    <p className="text-main-text font-serif text-xl italic">
                                        Категорій за такими критеріями фільтрації не знайдено.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categories.map((cat: any) => (
                                        <div
                                            key={cat.id}
                                            onClick={() => router.push(`/category/${cat.id || cat.slug}`)}
                                            // ДОДАНО: relative і group для кнопки видалення
                                            className="relative group p-5 bg-brand-border/10 border border-dark-color-bar/10 hover:border-website-name hover:bg-brand-border/30 transition-all cursor-pointer shadow-2xs rounded-sm flex flex-col justify-between"
                                        >
                                            {/* ДОДАНО: Кнопка видалення (показується тільки адмінам при наведенні) */}
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => handleDeleteCategory(cat.id, e)}
                                                    className="absolute top-3 right-3 text-[#A01E36] bg-[#FFF5F5] hover:bg-[#A01E36] hover:text-white border border-[#A01E36]/30 px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                                    title="Видалити категорію назавжди"
                                                >
                                                    ✕ Видалити
                                                </button>
                                            )}

                                            <h3 className="text-website-links font-bold text-lg mb-2 pr-20">
                                                📁 {cat.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 italic line-clamp-2">
                                                {cat.description || "Опис структури знань відсутній."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}