"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function ProfilePage() {
    const [isMounted, setIsMounted] = useState(false);
    // динамічні стани для даних з бекенду
    const [userInfo, setUserInfo] = useState<any>(null);
    const [recentPublications, setRecentPublications] = useState<any[]>([]);
    const [savedArticles, setSavedArticles] = useState<any[]>([]);
    // системні стани життєвого циклу запиту
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // стани для фільтрації та сортування
    const [pubSearch, setPubSearch] = useState("");
    const [pubSortOrder, setPubSortOrder] = useState("date-desc");
    // async mounting req
    useEffect(() => {
        setIsMounted(true);
        setLoading(true);
        setError(null);
        // backend address (from .env.local)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        // запит на ендпоінт
        // Примітка: якщо у вас є сервіс, цей fetch можна замінити на: profileService.getProfileData()
        fetch(`${baseUrl}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Не вдалося завантажити дані профілю.');
                return res.json();
            })
            .then((data: any) => {
                // розподіляємо отриманий JSON-пакет по відповідних станах
                setUserInfo(data.userInfo);
                setRecentPublications(data.recentPublications || []);
                setSavedArticles(data.savedArticles || []);
            })
            .catch((err: any) => {
                console.error("Profile load error:", err);
                setError("Немає відповіді сервера або сесія користувача застаріла.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (!isMounted) return null;
    // обробка стану завантаження
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-serif">
                <Header />
                <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                    <Sidebar />
                    <main className="flex-grow p-8 text-center italic text-main-text animate-pulse">
                        Завантаження інформації кабінету WiKPIdia з бази даних...
                    </main>
                </div>
            </div>
        );
    }
    // обробка критичної помилки зв'язку
    if (error || !userInfo) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-serif">
                <Header />
                <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                    <Sidebar />
                    <main className="flex-grow p-8 flex flex-col justify-center items-center text-center">
                        <span className="text-3xl mb-2">⚠️</span>
                        <h2 className="text-[#A01E36] font-bold text-lg italic">Помилка авторизації</h2>
                        <p className="text-main-text/70 text-sm max-w-md italic mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="bg-search-button hover:bg-website-name text-white px-6 py-2 text-xs font-bold uppercase tracking-wider">
                            Повторити спробу
                        </button>
                    </main>
                </div>
            </div>
        );
    }
    // визначення рівня доступу на основі динамічних даних
    const isPrivileged = userInfo.role === "Адміністратор" || userInfo.role === "Модератор" || userInfo.role === "Адмін";
    const cabinetSubtitle = isPrivileged
        ? "Особистий кабінет розробника"
        : "Особистий кабінет користувача";
    // логіка фільтрації та сортування
    const getFilteredAndSortedPublications = () => {
        let items = recentPublications.filter((pub: any) =>
            pub.title.toLowerCase().includes(pubSearch.toLowerCase())
        );
        return items.sort((a: any, b: any) => {
            if (pubSortOrder === "alpha-asc") return a.title.localeCompare(b.title);
            if (pubSortOrder === "alpha-desc") return b.title.localeCompare(a.title);
            if (pubSortOrder === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 space-y-8 overflow-hidden">
                    {/* головний заголовок */}
                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white text-search-button p-2 rounded-full font-bold text-xl w-10 h-10 flex items-center justify-center uppercase">
                                {userInfo.username ? userInfo.username[0] : "U"}
                            </div>
                            <div>
                                <h1 className="text-white text-2xl font-bold italic">{userInfo.username}</h1>
                                <p className="text-white/80 text-xs italic">{cabinetSubtitle}</p>
                            </div>
                        </div>
                        <div className="bg-dark-color-bar text-white text-xs px-3 py-1 uppercase tracking-wider font-bold">
                            {userInfo.role}
                        </div>
                    </div>
                    {/* основна сітка даних */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* картка профілю зліва */}
                        <div className="space-y-6 lg:col-span-1">
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-brand-border/5">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Інформація користувача</div>
                                <div className="p-4 space-y-3 text-sm text-main-text">
                                    <div><span className="font-bold italic">ПІБ:</span> {userInfo.fullName}</div>
                                    <div><span className="font-bold italic">Ел. адреса:</span> {userInfo.email}</div>
                                    <div><span className="font-bold italic">Дата реєстрації:</span> {userInfo.createdAt}</div>
                                </div>
                            </div>

                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Коментарі</div>
                                <div className="p-6 text-center space-y-4">
                                    <p className="text-sm italic text-gray-600">Всі ваші коментарі, запитання та відповіді до статей перенесено у розділ</p>
                                    <Link
                                        href="/profile/discussions"
                                        className="inline-block w-full text-center bg-search-button hover:bg-website-name text-white font-bold py-2 transition-colors shadow-sm uppercase tracking-wide text-sm"
                                    >
                                        Мої обговорення
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* публікації та збережені статті справа */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* нещодавні публікації правок/статей */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex flex-wrap justify-between items-center gap-2">
                                    <span>Нещодавні публікації (мої статті та правки)</span>
                                    <select
                                        value={pubSortOrder}
                                        onChange={(e: any) => setPubSortOrder(e.target.value)}
                                        className="bg-light-color-bar text-main-text text-sm p-1 font-serif italic outline-none border border-dark-color-bar/20 cursor-pointer"
                                    >
                                        <option value="date-desc">Від нових до старих</option>
                                        <option value="date-asc">Від старих до нових</option>
                                        <option value="alpha-asc">За алфавітом (А-Я)</option>
                                        <option value="alpha-desc">За алфавітом (Я-А)</option>
                                    </select>
                                </div>

                                <div className="p-4 space-y-4">
                                    <input
                                        type="text"
                                        value={pubSearch}
                                        onChange={(e: any) => setPubSearch(e.target.value)}
                                        placeholder="Шукати у публікаціях..."
                                        className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/70"
                                    />
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {getFilteredAndSortedPublications().length > 0 ? (
                                            getFilteredAndSortedPublications().map((pub: any) => (
                                                <div key={pub.id} className="flex justify-between items-center p-2 bg-brand-border/10 border-l-2 border-search-button text-xs italic">
                                                    <span className="font-bold text-main-text line-clamp-1">{pub.title}</span>
                                                    <div className="flex gap-4 text-gray-500 shrink-0">
                                                        <span>{pub.type || "Правка"}</span>
                                                        <span>{pub.date}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-xs text-gray-400 py-4 italic">Нічого не знайдено.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* збережені статті */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 shrink-0 text-white" fill="currentColor">
                                        <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/>
                                    </svg>
                                    <span>Збережені статті (від нових до давніших)</span>
                                </div>

                                <div className="p-4 bg-brand-border/5">
                                    <div className="space-y-2">
                                        {savedArticles.length > 0 ? (
                                            savedArticles.map((saved: any) => (
                                                <div key={saved.id} className="p-3 bg-white border border-dark-color-bar/10 flex justify-between items-center text-m shadow-2xs italic">
                                                    {/* При кліку на назву перенаправляємо на сторінку цієї статті */}
                                                    <Link href={`/article/${saved.slug || saved.id}`} className="text-website-links font-bold hover:underline cursor-pointer">
                                                        {saved.title}
                                                    </Link>
                                                    <span className="text-gray-400 text-[14px] shrink-0">
                                                        Збережено: {saved.savedAt}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-xs text-gray-400 py-4 italic">У вас немає збережених статей.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}