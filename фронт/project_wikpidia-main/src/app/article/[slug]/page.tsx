"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ArticleTabs from '@/components/ArticleTabs';
import { articleService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Описуємо типи даних для TypeScript
interface Category {
    id: number;
    name: string;
}

interface ArticleData {
    id: number;
    title: string;
    content: string;
    mainImage?: string;
    categories?: Category[];
    version?: string;
    author?: string;
    comment?: string;
}

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { user, token } = useAuth();

    const fallbackTitle = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : "Завантаження...";

    const [article, setArticle] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    const loadArticleData = () => {
        if (!slug) return;
        articleService.getArticleBySlug(slug)
            .then((data: ArticleData) => setArticle(data))
            .catch((err: Error) => setError("Статтю не знайдено або сервер не відповідає."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadArticleData();
    }, [slug]);

    // Завантаження всіх категорій для адмін-панелі
    useEffect(() => {
        if (user && (user.role === 'Адмін' || user.role === 'Адміністратор' || user.role === 'ADMIN' || user.role === 'Головний редактор')) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            fetch(`${baseUrl}/api/categories`)
                .then(res => res.json())
                .then(data => setAllCategories(data || []))
                .catch(err => console.error("Помилка завантаження списку категорій:", err));
        }
    }, [user]);

    const handleAddCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = Number(e.target.value);
        if (!categoryId || !token) return;

        try {
            await articleService.assignCategory(slug, categoryId, token);
            loadArticleData();
            e.target.value = "";
        } catch (err: unknown) {
            setCategoryError("Не вдалося додати категорію.");
        }
    };

    const handleRemoveCategory = async (categoryId: number, categoryName: string) => {
        const confirmRemove = window.confirm(
            `Ви впевнені, що хочете вилучити статтю з категорії "${categoryName}"?`
        );
        if (!confirmRemove || !token) return;

        try {
            await articleService.removeCategory(slug, categoryId, token);
            loadArticleData();
        } catch (err: unknown) {
            setCategoryError("Не вдалося вилучити категорію.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "🚨 УВАГА! Ви впевнені, що хочете остаточно видалити цю статтю?"
        );
        if (!confirmDelete || !token) return;

        setIsDeleting(true);
        try {
            await articleService.deleteArticle(slug, token);
            router.push('/');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Сталася помилка під час видалення.";
            alert(errorMessage);
            setIsDeleting(false);
        }
    };

    const handleSaveArticle = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setIsSaving(true);
        try {
            await articleService.saveArticleToProfile(slug, token);
            alert("Статтю успішно збережено у вашому особистому кабінеті.");
        } catch (err: unknown) {
            console.error("error saving article:", err);
            const errorMessage = err instanceof Error ? err.message : "Не вдалося зберегти статтю.";
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const isAuthorizedToSubmoderate = user && (user.role === 'Адмін' || user.role === 'Адміністратор' || user.role === 'ADMIN' || user.role === 'Головний редактор');
    const hasMetadata = article;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 overflow-hidden">
                    <ArticleTabs slug={slug || "new-article"} />

                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-2xl md:text-3xl font-bold italic">
                            {loading ? fallbackTitle : (article?.title || fallbackTitle)}
                        </h1>
                    </div>

                    {loading && (
                        <div className="space-y-4 animate-pulse bg-brand-border/10 p-6 border border-dark-color-bar/10 min-h-[500px]">
                            <div className="h-6 bg-dark-color-bar/20 w-1/4 rounded-xs"></div>
                            <div className="h-4 bg-dark-color-bar/10 w-full rounded-xs"></div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-6 font-serif rounded-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                            <span className="text-3xl mb-2">⚠️</span>
                            <p className="text-[#A01E36] font-bold text-lg mb-1 italic">{error}</p>
                            <Link href="/profile" className="mt-6 text-xs text-website-links hover:underline font-bold uppercase tracking-wider">
                                Повернутися до особистого кабінету
                            </Link>
                        </div>
                    )}

                    {!loading && !error && article && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Текст статті */}
                            <div className="flex-grow bg-brand-border/10 p-6 border border-dark-color-bar/10 rounded-sm min-h-[500px] w-full max-w-full overflow-hidden">
                                <div
                                    className="wiki-preview-content text-main-text leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>

                            {/* Інструменти збоку */}
                            {hasMetadata && (
                                <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                                    {/* Швидкі дії користувача */}
                                    <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white p-4">
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={handleSaveArticle}
                                            className="w-full bg-search-button hover:bg-website-name text-white font-serif font-bold text-xs uppercase tracking-wider py-2.5 px-4 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                            </svg>
                                            {isSaving ? "Збереження..." : "Зберегти статтю"}
                                        </button>
                                    </div>

                                    {/* Зображення */}
                                    {article.mainImage && (
                                        <div className="border-4 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                            <div className="bg-light-color-bar h-64 flex items-center justify-center p-4">
                                                <img src={article.mainImage} alt={article.title} className="max-h-56 mx-auto object-contain" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Присвоєні категорії статті */}
                                    <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                        <div className="bg-brand-border p-2 text-center font-bold text-xs uppercase tracking-wide text-website-name border-b border-dark-color-bar/20">
                                            Категорії матеріалу
                                        </div>
                                        <div className="p-3 flex flex-wrap gap-2">
                                            {article.categories && article.categories.length > 0 ? (
                                                article.categories.map((cat: Category) => (
                                                    <button
                                                        key={cat.id}
                                                        disabled={!isAuthorizedToSubmoderate}
                                                        onClick={() => handleRemoveCategory(cat.id, cat.name)}
                                                        className={`text-xs font-serif italic px-2 py-1 border transition-all ${
                                                            isAuthorizedToSubmoderate
                                                                ? "bg-[#FFF5F5] hover:bg-[#FDE8E8] text-[#A01E36] border-[#A01E36]/25 hover:border-[#A01E36] cursor-pointer"
                                                                : "bg-light-color-bar text-main-text border-dark-color-bar/10 cursor-default"
                                                        }`}
                                                        title={isAuthorizedToSubmoderate ? "Натисніть, щоб вилучити статтю з цієї категорії" : ""}
                                                    >
                                                        {cat.name} {isAuthorizedToSubmoderate && "✕"}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic p-1">Статті не присвоєно жодної категорії.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* 1. Блок керування категоріями (адмін) */}
                                    {isAuthorizedToSubmoderate && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-[#F8FAFC] space-y-4 p-4">
                                            <div className="font-bold text-xs uppercase tracking-wide text-gray-700 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                                                Додати статтю в категорію
                                            </div>

                                            {categoryError && (
                                                <p className="text-[11px] text-[#A01E36] italic">{categoryError}</p>
                                            )}

                                            <select
                                                onChange={handleAddCategory}
                                                defaultValue=""
                                                className="w-full p-2 bg-white border border-dark-color-bar/20 outline-none text-xs font-serif italic cursor-pointer"
                                            >
                                                <option value="" disabled>Оберіть варіант</option>
                                                {allCategories
                                                    .filter(c => !article.categories?.some((ac: Category) => ac.id === c.id))
                                                    .map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    )}

                                    {/* 2. Блок НЕБЕЗПЕЧНА ЗОНА - Видалення (адмін) */}
                                    {isAuthorizedToSubmoderate && (
                                        <div className="border-2 border-[#A01E36]/30 rounded-sm overflow-hidden shadow-sm bg-[#FFF5F5] p-4 mt-2">
                                            <div className="font-bold text-xs uppercase tracking-wide text-[#A01E36] flex items-center gap-1.5 border-b border-[#A01E36]/10 pb-2 mb-3">
                                                Небезпечна зона
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={handleDelete}
                                                className="w-full bg-[#A01E36] hover:bg-[#84172B] disabled:bg-[#A01E36]/50 text-white font-bold text-xs uppercase tracking-wider py-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                {isDeleting ? "Видалення..." : "Видалити всю статтю"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Версія, автор */}
                                    {(article.version || article.author || article.comment) && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white text-xs">
                                            <table className="w-full border-collapse">
                                                <tbody>
                                                {article.version && (
                                                    <tr className="border-b border-dark-color-bar/10"><td className="p-2 bg-light-color-bar font-bold w-1/3 italic">Версія</td><td className="p-2 bg-white italic font-bold">v{article.version}</td></tr>
                                                )}
                                                {article.author && (
                                                    <tr className="border-b border-dark-color-bar/10"><td className="p-2 bg-light-color-bar font-bold italic">Автор</td><td className="p-2 bg-white italic text-website-links font-bold">@{article.author}</td></tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </aside>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}