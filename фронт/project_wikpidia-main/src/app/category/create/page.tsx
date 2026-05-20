// src\app\category\create\page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function CreateCategoryPage() {
    const router = useRouter();
    const { user, token } = useAuth();

    // Стани форми
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Стани для статей
    const [existingArticles, setExistingArticles] = useState<any[]>([]);
    const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);

    // Системні стани
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Перевірка прав адміністратора
    const isPrivileged = user && (user.role === 'Адміністратор' || user.role === 'Адмін' || user.role === 'ADMIN' || user.role === 'Головний редактор');

    // Завантаження списку доступних статей при відкритті сторінки
    useEffect(() => {
        if (isPrivileged) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            fetch(`${baseUrl}/api/articles`) // Отримуємо всі опубліковані статті
                .then(res => res.json())
                .then(data => {
                    setExistingArticles(data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Помилка завантаження статей:", err);
                    setError("Не вдалося завантажити список доступних статей з сервера.");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [isPrivileged]);

    // Обробник вибору статей (галочки)
    const handleArticleSelection = (id: number) => {
        setSelectedArticleIds(prev =>
            prev.includes(id)
                ? prev.filter(articleId => articleId !== id)
                : [...prev, id]
        );
    };

    // Відправка форми на сервер
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Помилка: Назва категорії є обов'язковою!");
            return;
        }

        setIsSubmitting(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            const response = await fetch(`${baseUrl}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    articleIds: selectedArticleIds // Відправляємо масив обраних ID статей
                })
            });

            if (!response.ok) {
                throw new Error("Не вдалося створити категорію. Можливо, така назва вже існує.");
            }

            alert("Категорію успішно створено!");
            router.push('/category'); // Повертаємося на сторінку пошуку категорій

        } catch (err: any) {
            console.error(err);
            alert(err.message || "Сталася помилка під час створення категорії.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 space-y-8 overflow-hidden">

                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center justify-between">
                        <h1 className="text-white text-2xl font-bold italic">Створення нової категорії</h1>
                        <Link href="/category" className="text-white/80 text-sm hover:underline cursor-pointer">
                            ← Повернутися до пошуку
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 italic text-gray-500 animate-pulse">
                            Перевірка прав доступу та завантаження бази статей...
                        </div>
                    ) : !isPrivileged ? (
                        // БЛОК ЗАБОРОНИ ДОСТУПУ
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-8 text-center shadow-sm">
                            <span className="text-4xl block mb-4">🛡️</span>
                            <h2 className="text-[#A01E36] font-bold text-xl italic mb-2">Доступ заборонено</h2>
                            <p className="text-main-text/80 italic mb-6">
                                Створювати нові структури знань можуть виключно Адміністратори системи. <br />
                                Ваш поточний рівень доступу не дозволяє виконати цю дію.
                            </p>
                            <Link href="/" className="inline-block bg-search-button text-white font-bold px-6 py-2 uppercase tracking-wider text-sm transition-colors hover:bg-website-name">
                                На головну
                            </Link>
                        </div>
                    ) : (
                        // ФОРМА СТВОРЕННЯ (Тільки для Адмінів)
                        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

                            {/* ЛІВА КОЛОНКА: Основні дані */}
                            <div className="flex-grow space-y-6">
                                <div className="border border-dark-color-bar/20 rounded-sm bg-white shadow-sm overflow-hidden">
                                    <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">
                                        Основна інформація
                                    </div>
                                    <div className="p-6 space-y-5 bg-brand-border/5">
                                        <div>
                                            <label className="block text-sm font-bold text-main-text italic mb-2 uppercase tracking-wide">
                                                Назва категорії <span className="text-[#A01E36]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Наприклад: Вища математика"
                                                className="w-full p-3 bg-white border border-dark-color-bar/20 outline-none text-main-text font-serif italic focus:border-search-button transition-colors shadow-2xs"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-main-text italic mb-2 uppercase tracking-wide">
                                                Опис категорії
                                            </label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Коротко опишіть, які саме статті будуть знаходитись у цій категорії..."
                                                className="w-full h-32 p-3 bg-white border border-dark-color-bar/20 outline-none resize-none text-main-text font-serif italic focus:border-search-button transition-colors shadow-2xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ПРАВА КОЛОНКА: Прив'язка існуючих статей */}
                            <aside className="w-full lg:w-[400px] shrink-0 space-y-6">
                                <div className="border border-dark-color-bar/20 rounded-sm bg-white shadow-sm overflow-hidden flex flex-col h-[500px]">
                                    <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">
                                        Прив'язка існуючих статей
                                    </div>

                                    <div className="p-4 bg-[#F8FAFC] border-b border-gray-200">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider text-center font-bold">
                                            Увага: Додавати можна ТІЛЬКИ вже створені статті.
                                        </p>
                                    </div>

                                    {error ? (
                                        <div className="p-4 text-xs italic text-[#A01E36] text-center">{error}</div>
                                    ) : (
                                        <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-brand-border/5">
                                            {existingArticles.length === 0 ? (
                                                <p className="text-center text-sm italic text-gray-500 py-10">
                                                    У базі даних ще немає жодної статті.
                                                </p>
                                            ) : (
                                                existingArticles.map((article) => (
                                                    <label
                                                        key={article.id}
                                                        className="flex items-start gap-3 p-3 bg-white border border-gray-200 shadow-2xs cursor-pointer hover:bg-gray-50 transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedArticleIds.includes(article.id)}
                                                            onChange={() => handleArticleSelection(article.id)}
                                                            className="mt-1 cursor-pointer accent-search-button"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-sm text-website-links line-clamp-1">{article.title}</div>
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">ID: {article.id} • Slug: {article.slug}</div>
                                                        </div>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Кнопка збереження */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-search-button hover:bg-website-name text-white font-bold py-3 uppercase tracking-wider text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? "Створення..." : "Зберегти категорію"}
                                </button>
                            </aside>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
}