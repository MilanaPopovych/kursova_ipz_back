"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id ? (params.id as string) : "";
    const categoryName = params.id ? decodeURIComponent(params.id as string).replace(/-/g, ' ') : "Категорія";
    // Пошукові фільтри
    const [searchTerm, setSearchTerm] = useState("");
    const [contentType, setContentType] = useState("articles"); // Початковий режим — статті

    // СТАНДАРТНІ СТАНИ СЕРВЕРНОЇ ІНТЕГРАЦІЇ
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ФУНКЦІЯ ЗАПИТУ ДО БЕКЕНДУ SPRING BOOT
    const fetchCategoryContent = async (query: string, type: string) => {
        if (!categoryId) return;

        setLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            // REST-запит із фільтрацією типу: /api/categories/{id}/search?query=...&type=articles
            const response = await fetch(
                `${baseUrl}/api/categories/${encodeURIComponent(categoryId)}/search?query=${encodeURIComponent(query)}&type=${type}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Сервер повернув помилку під час обробки контенту категорії.');
            }

            const data = await response.json();
            setResults(data || []);
        } catch (err: any) {
            console.error("Category detail fetch error:", err);
            setError("Не вдалося отримати контент. Перевірте працездатність вашого Spring Boot додатка.");
        } finally {
            setLoading(false);
        }
    };

    // АВТОМАТИЧНА СИНХРОНІЗАЦІЯ: Оновлює контент відразу при відкритті сторінки або зміні фільтра в select
    useEffect(() => {
        fetchCategoryContent(searchTerm, contentType);
    }, [categoryId, contentType]); // Масив залежностей тригерить автоматичний перезапит

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCategoryContent(searchTerm, contentType);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setContentType(selectedType); // useEffect автоматично викличе fetchCategoryContent
    };

    // ОБРОБНИК ДЛЯ КНОПКИ ДОВАДАННЯ СТАТТІ В ПОТОЧНУ КАТЕГОРІЮ
    const handleAddArticleRedirect = () => {
        // перенаправляємо в текстовий редактор правок і прокидаємо ID категорії
        router.push(`/article/create?categoryId=${encodeURIComponent(categoryId)}`);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl overflow-hidden">

                    {/* ЗАГОЛОВОК КАТЕГОРІЇ + КНОПКА ДОДАННЯ СТАТТІ */}
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic uppercase tracking-wide">
                            Категорія: {categoryName}
                        </h1>

                        {/* ІНТЕГРОВАНА КНОПКА ДОДАННЯ */}
                        <button
                            type="button"
                            onClick={handleAddArticleRedirect}
                            className="bg-search-button hover:bg-website-name text-white font-serif font-bold text-xs uppercase tracking-wider px-4 py-2 border border-white/20 transition-colors flex items-center justify-center gap-2 self-start sm:self-auto flex-shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Додати статтю
                        </button>
                    </div>

                    {/* БЛОК ФІЛЬТРАЦІЇ ТА ВНУТРІШНЬОГО ПОШУКУ */}
                    <div className="space-y-4 mb-10 pl-2">
                        <form onSubmit={handleSearchSubmit} className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                placeholder={`Пошук контенту всередині "${categoryName}"...`}
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
                        {/* селект вибору контенту категорії */}
                        <div className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <select
                                value={contentType}
                                onChange={handleTypeChange}
                                className="flex-grow px-4 bg-light-color-bar text-main-text italic outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="articles">Статті цієї категорії</option>
                                <option value="subcategories">Підкатегорії (Вкладені гілки)</option>
                                <option value="authors">Автори матеріалів</option>
                            </select>
                            <div className="bg-search-button w-16 flex items-center justify-center flex-shrink-0 pointer-events-none text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {/* loading */}
                    {loading && (
                        <div className="text-center py-6 font-serif italic text-main-text animate-pulse">
                            Синхронізація контенту з базою даних...
                        </div>
                    )}
                    {/* backend err */}
                    {!loading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-sm font-serif italic text-[#A01E36]">
                            {error}
                        </div>
                    )}
                    {/* відображення результатів */}
                    {!loading && !error && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-website-name text-lg font-bold italic border-b border-dark-color-bar/20 pb-2 uppercase mb-6">
                                Результати фільтрації структури ({results.length}):
                            </h2>

                            {results.length === 0 ? (
                                <div className="py-10 text-center border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/10">
                                    <p className="text-main-text font-serif text-xl italic">Результатів не знайдено</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {results.map((item: any) => {
                                        // Розумна динамічна маршрутизація картки результату
                                        let targetUrl = `/article/${item.slug || item.id}`;
                                        if (contentType === 'authors') targetUrl = `/user/${item.username || item.id}`;
                                        if (contentType === 'subcategories') targetUrl = `/category/${item.id}`;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => router.push(targetUrl)}
                                                className="p-4 bg-brand-border/20 border-l-4 border-search-button hover:bg-brand-border/50 hover:border-website-name transition-all cursor-pointer shadow-2xs rounded-r-xs"
                                            >
                                                <h3 className="text-website-links font-bold text-xl mb-1 hover:underline">
                                                    {item.title || item.fullName || item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 italic">
                                                    {item.description || item.snippet || `Ресурс підсистеми категорії ${categoryName}.`}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}