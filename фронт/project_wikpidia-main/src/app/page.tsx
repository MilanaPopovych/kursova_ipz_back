// app\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ДОДАНО: імпорт компонента Link

export default function HomePage() {
    const [query, setQuery] = useState(""); // стан для тексту пошуку
    const router = useRouter();

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/search");
        }
    };

    return (
        <main className="flex flex-col items-center justify-between h-screen bg-white p-4 md:p-6 overflow-hidden">
            {/* заголовок та підзаголовок */}
            <div className="text-center mt-4 md:mt-10">
                <h1 className="text-website-name text-3xl md:text-5xl font-serif font-bold italic leading-tight">
                    Онлайн-енциклопедія WiKPIdia
                </h1>
                <p className="text-website-subtitle text-lg md:text-xl italic font-serif mt-2">
                    Університетська база знань
                </p>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow w-full gap-8">
                {/* логотип */}
                <img
                    src="/logo_blue.svg"
                    alt="WiKPIdia Logo"
                    className="w-44 h-44 md:w-56 md:h-56 object-contain"
                />

                {/* Блок з панеллю пошуку та посиланням */}
                <div className="w-full max-w-xl flex flex-col items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full h-12 shadow-md rounded-sm overflow-hidden border border-dark-color-bar/30"
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Почніть пошук..."
                            className="flex-grow px-5 bg-light-color-bar text-main-text placeholder:text-main-text/40 italic outline-none text-lg font-serif border-none"
                        />
                        <button
                            type="submit"
                            className="bg-search-button hover:bg-website-name transition-colors px-6 flex items-center justify-center cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-6 w-6 text-white"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* ДОДАНО: Посилання на сторінку логіну */}
                    <Link
                        href="/login"
                        className="text-website-links hover:underline font-serif italic text-[15px]"
                    >
                        Увійти в кабінет
                    </Link>
                </div>
            </div>

            {/* блоки інформації */}
            <div className="w-full max-w-7xl flex flex-row justify-between items-end gap-4 pb-6">
                <div className="bg-brand-border p-4 rounded-sm min-w-[260px] text-main-text font-serif text-sm shadow-sm border border-dark-color-bar/10">
                    <p className="font-bold mb-1 border-b border-dark-color-bar/20 pb-1">Автори:</p>
                    <p>Шеремета А. Р. (sheremeta.a.r.-io46@edu.kpi.ua)</p>
                    <p>Попович М. О. (popovych.m.o.-io46@edu.kpi.ua)</p>
                </div>

                <div className="bg-brand-border p-4 rounded-sm min-w-[260px] text-main-text font-serif text-sm text-right shadow-sm border border-dark-color-bar/10">
                    <p>
                        Офіційний сайт КПІ: <br/>
                        <a
                            href="https://kpi.ua"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-website-links hover:underline font-medium inline-block mt-1"
                        >
                            https://kpi.ua
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}