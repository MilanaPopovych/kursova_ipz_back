"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // зчитування параметрів з URL
    const urlQuery = searchParams.get("q") || "";
    const urlType = searchParams.get("type") || "articles"; // За замовчуванням шукаємо статті
    // локальні стани для керування полями вводу
    const [query, setQuery] = useState(urlQuery);
    const [searchType, setSearchType] = useState(urlType);
    // стандартні дані
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // АСИНХРОННА ФУНКЦІЯ ЗАПИТУ ДО SPRING BOOT
    const executeBackendSearch = async (searchQuery: string, dataType: string) => {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            // запит на ендпоінт глобального глобального пошуку
            const response = await fetch(
                `${baseUrl}/api/search?q=${encodeURIComponent(searchQuery)}&type=${dataType}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Помилка сервера під час обробки пошукового запиту.');
            }

            const data = await response.json();
            setResults(data || []);
        } catch (err: any) {
            console.error("Глобальна помилка пошуку:", err);
            setError("Перевірте працездатність Spring Boot додатка.");
        } finally {
            setLoading(false);
        }
    };

    // ефект синхронізації: реагує на зміни URL
    useEffect(() => {
        setQuery(urlQuery);
        setSearchType(urlType);

        if (urlQuery.trim()) {
            executeBackendSearch(urlQuery, urlType);
        } else {
            setResults([]); // якщо запит порожній — чистимо результати
        }
    }, [searchParams]); // спрацьовує щоразу, коли змінюються query-параметри в URL

    // обробник натискання кнопки пошуку або Enter
    const handleMainSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // оновлюємо URL-адресу, що автоматично викличе useEffect
            router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`);
        }
    };
    // обробник миттєвої зміни типу контенту в select
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setSearchType(selectedType);
        // якщо в полі вже є текст, відразу перезапускаємо пошук із новим типом контенту
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${selectedType}`);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl overflow-hidden">
                    {/* ЗАГОЛОВОК СТОРІНКИ */}
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex items-center shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            Пошук
                        </h1>
                    </div>
                    {/* ФОРМА ФІЛЬТРАЦІЇ ТА ПОШУКУ */}
                    <div className="space-y-4 mb-10 pl-2">
                        {/* ПОЛЕ ВВЕДЕННЯ ТЕКСТУ ДЛЯ ЗАПИТУ */}
                        <form onSubmit={handleMainSearch} className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <input
                                type="text"
                                value={query}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                placeholder="Введіть тему чи ключові слова для пошуку..."
                                className="flex-grow px-5 bg-light-color-bar text-main-text placeholder:text-main-text/40 italic outline-none text-lg border-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-search-button hover:bg-website-name transition-colors w-16 flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6 text-white">
                                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                                </svg>
                            </button>
                        </form>

                        {/* Селект вибору типу даних */}
                        <div className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <select
                                value={searchType}
                                onChange={handleTypeChange}
                                className="flex-grow px-4 bg-light-color-bar text-main-text italic outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="articles">Статті енциклопедії</option>
                                <option value="categories">Категорії знань</option>
                            </select>

                            <div className="bg-search-button w-16 flex items-center justify-center flex-shrink-0 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    {/* СТАН БЕЗ ПОШУКУ */}
                    {!urlQuery && (
                        <div className="mt-8 p-6 border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/5 text-main-text/60 italic text-lg text-center">
                            <p>Використовуйте форму вище для глобального пошуку інформації в базі даних</p>
                        </div>
                    )}
                    {/* стан завантаження даних */}
                    {loading && (
                        <div className="mt-8 text-center font-serif italic text-main-text animate-pulse">
                            Виконується індексація та пошук у базі даних PostgreSQL...
                        </div>
                    )}
                    {/* стан помилки зв'язку */}
                    {!loading && error && (
                        <div className="mt-8 bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-sm font-serif italic text-[#A01E36]">
                            {error}
                        </div>
                    )}
                    {/* рендер отриманих результатів */}
                    {!loading && !error && urlQuery && (
                        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-gray-600 italic text-sm">
                                Результати пошуку за запитом: <span className="font-bold text-website-name">"{urlQuery}"</span>
                                <span className="text-gray-400"> (знайдено об'єктів: {results.length})</span>
                            </p>

                            {results.length === 0 ? (
                                /* з бекенду прийшов порожній масив */
                                <div className="py-12 text-center border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/5">
                                    <p className="text-main-text font-serif text-lg italic">
                                        За запитом "{urlQuery}" у розділі "{searchType}" нічого не знайдено. <br />
                                        Спробуйте змінити критерії пошуку чи перевірте орфографію.
                                    </p>
                                </div>
                            ) : (
                                /* ітерація масиву знайдених сутностей */
                                <div className="space-y-4">
                                    {results.map((item: any) => {
                                        // автоматична маршрутизація картки результату залежно від обраного типу
                                        let destinationUrl = `/article/${item.slug || item.id}`;
                                        if (urlType === 'authors') destinationUrl = `/profile/${item.username || item.id}`;
                                        if (urlType === 'categories') destinationUrl = `/category/${item.id}`;

                                        return (
                                            <div
                                                key={item.id}
                                                className="border-b border-dark-color-bar/10 pb-4 last:border-b-0 group"
                                            >
                                                <Link href={destinationUrl}>
                                                    <h3 className="text-xl text-website-links font-bold hover:underline cursor-pointer mb-1 group-hover:text-website-name transition-colors">
                                                        {item.title || item.fullName || item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-700 leading-relaxed italic line-clamp-3">
                                                    {item.description || item.snippet || item.comment || "Довідкова інформація відсутня."}
                                                </p>
                                                {item.updatedAt && (
                                                    <span className="text-[10px] text-gray-400 block mt-1">Остання активність: {item.updatedAt}</span>
                                                )}
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