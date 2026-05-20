"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ArticleTabs from '@/components/ArticleTabs';
import { articleService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface DiscussionTopic {
    id: number;
    title: string;
    content?: string;
    author?: string;
    createdAt?: string;
}

export default function DiscussionPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { user, token } = useAuth();

    const [articleTitle, setArticleTitle] = useState("Завантаження...");
    const [dbTopics, setDbTopics] = useState<DiscussionTopic[]>([]);
    const [filteredTopics, setFilteredTopics] = useState<DiscussionTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);

    const [topicSearch, setTopicSearch] = useState("");
    const [comment, setComment] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Перевірка, чи має користувач права на видалення
    const isAuthorizedToModerate = user && (user.role === 'Адмін' || user.role === 'Адміністратор' || user.role === 'ADMIN' || user.role === 'Головний редактор');

    const loadData = () => {
        if (!slug) return;
        setLoading(true);

        articleService.getArticleBySlug(slug)
            .then((data: any) => setArticleTitle(data.title || slug))
            .catch(() => setArticleTitle(`Стаття ${slug}`));

        articleService.getDiscussionTopics(slug)
            .then((data: DiscussionTopic[]) => {
                setDbTopics(data || []);
                setServerError(null);
            })
            .catch((err) => {
                console.error("Discussion fetch error:", err);
                setServerError("Не вдалося завантажити історію обговорень з сервера.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, [slug]);

    useEffect(() => {
        if (topicSearch.trim().length > 0) {
            const results = dbTopics.filter(topic =>
                topic.title.toLowerCase().includes(topicSearch.toLowerCase())
            );
            setFilteredTopics(results);
            setIsDropdownOpen(true);
        } else {
            setFilteredTopics([]);
            setIsDropdownOpen(false);
        }
    }, [topicSearch, dbTopics]);

    const handleAddTopic = async () => {
        if (!token) {
            alert("Помилка авторизації: Лише зареєстровані автори системи можуть брати участь в обговореннях!");
            router.push('/login');
            return;
        }

        if (!topicSearch.trim() || !comment.trim()) {
            alert("Помилка валідації: Будь ласка, заповніть назву теми та текст повідомлення.");
            return;
        }

        setIsSubmitting(true);
        try {
            // ДОДАНО: Дістаємо ім'я користувача. Якщо раптом поля username немає, беремо login, інакше "Користувач"
            // @ts-ignore - ігноруємо помилку TS, якщо тип user не повністю описаний
            const authorName = user?.username || user?.login || "Користувач";

            // ЗМІНЕНО: Додали authorName у виклик функції
            await articleService.createDiscussionTopic(slug, topicSearch, comment, authorName, token);

            handleCancel();
            loadData();
        } catch (err: any) {
            alert(err.message || "Сталася помилка під час публікації.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTopic = async (topicId: number) => {
        const confirmDelete = window.confirm("🚨 Ви впевнені, що хочете назавжди видалити цей коментар?");
        if (!confirmDelete || !token) return;

        try {
            await articleService.deleteDiscussionTopic(slug, topicId, token);
            loadData();
        } catch (err: any) {
            alert(err.message || "Не вдалося видалити коментар.");
        }
    };

    const handleCancel = () => {
        setTopicSearch("");
        setComment("");
        setIsDropdownOpen(false);
    };

    const isFormDirty = topicSearch.trim().length > 0 || comment.trim().length > 0;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8">
                    <ArticleTabs slug={slug} />

                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            Обговорення статті "{articleTitle}"
                        </h1>
                    </div>

                    {serverError && (
                        <div className="mb-6 bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-xs italic text-[#A01E36]">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* ФОРМА ДОДАВАННЯ КОМЕНТАРЯ */}
                        <div className="relative border border-dark-color-bar/20 rounded-sm overflow-hidden">
                            <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic text-sm uppercase tracking-wide">
                                Введіть назву теми обговорення...
                            </div>
                            <div className="p-4 bg-brand-border/20">
                                <input
                                    type="text"
                                    value={topicSearch}
                                    onChange={(e) => setTopicSearch(e.target.value)}
                                    placeholder={loading ? "Завантаження списку тем..." : "Почніть вводити назву теми для перевірки дублікатів..."}
                                    disabled={loading || isSubmitting}
                                    className="w-full p-2 bg-white border border-dark-color-bar/10 outline-none italic text-sm"
                                />

                                {isDropdownOpen && (
                                    <div className="absolute left-4 right-4 mt-1 bg-white border border-dark-color-bar/20 shadow-lg z-10 max-h-48 overflow-y-auto rounded-sm">
                                        {filteredTopics.length > 0 ? (
                                            filteredTopics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    onClick={() => { setTopicSearch(topic.title); setIsDropdownOpen(false); }}
                                                    className="p-2.5 text-xs text-main-text hover:bg-brand-border/30 cursor-pointer border-b border-gray-100 last:border-none font-serif italic"
                                                >
                                                    {topic.title}
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="p-2.5 text-xs text-website-links font-bold cursor-pointer hover:bg-brand-border/30 italic"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Створити нову гілку: "{topicSearch}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden">
                            <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic text-sm uppercase tracking-wide">
                                Введіть повідомлення правок
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full h-32 p-4 bg-white outline-none resize-none text-sm leading-relaxed"
                                placeholder="Обґрунтуйте необхідність змін у контенті..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleAddTopic}
                                disabled={isSubmitting || loading}
                                className="bg-search-button hover:bg-website-name text-white px-8 py-2 text-xs uppercase tracking-wider font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? "Публікація..." : "Додати тему"}
                            </button>
                            {isFormDirty && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-2 text-xs uppercase tracking-wider font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Скасувати
                                </button>
                            )}
                        </div>

                        {/* ВІДОБРАЖЕННЯ ІСНУЮЧИХ ОБГОВОРЕНЬ */}
                        <div className="mt-12 pt-8 border-t-2 border-brand-border/50 space-y-4">
                            <div className="bg-light-color-bar px-4 py-2 border-b-2 border-dark-color-bar/20 font-bold italic text-main-text uppercase tracking-wide">
                                Історія обговорень ({dbTopics.length})
                            </div>

                            {dbTopics.length === 0 && !loading ? (
                                <p className="text-sm italic text-gray-500 p-4 bg-[#F8FAFC] border border-gray-100">
                                    Ще немає жодного обговорення. Будьте першим!
                                </p>
                            ) : (
                                dbTopics.map(topic => (
                                    <div key={topic.id} className="border border-brand-border/50 rounded-sm p-4 bg-[#F8FAFC] relative group">
                                        {isAuthorizedToModerate && (
                                            <button
                                                onClick={() => handleDeleteTopic(topic.id)}
                                                className="absolute top-4 right-4 text-[#A01E36] bg-[#FFF5F5] hover:bg-[#A01E36] hover:text-white border border-[#A01E36]/30 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                                title="Видалити цей коментар"
                                            >
                                                Видалити
                                            </button>
                                        )}

                                        <h3 className="font-bold text-website-name text-lg mb-2 pr-20">{topic.title}</h3>
                                        <p className="text-sm text-main-text whitespace-pre-wrap pr-4">{topic.content}</p>
                                        <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-200 uppercase tracking-wider">
                                            Автор: <span className="font-bold">{topic.author || 'Анонім'}</span> • {topic.createdAt ? new Date(topic.createdAt).toLocaleString('uk-UA') : 'Невідомий час'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}