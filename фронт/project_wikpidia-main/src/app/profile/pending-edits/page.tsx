"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PendingEditsPage() {
    const [pendingEdits, setPendingEdits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();

    const fetchPendingEdits = async () => {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        try {
            const res = await fetch(`${baseUrl}/api/articles/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                alert("Доступ заборонено. Ця сторінка тільки для адміністраторів.");
                router.push('/profile');
                return;
            }

            if (!res.ok) throw new Error("Не вдалося завантажити правки");
            const data = await res.json();
            setPendingEdits(data);
        } catch (error) {
            console.error("Помилка:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPendingEdits();
        }
    }, [token]);

    const handleApprove = async (id: number) => {
        if (!window.confirm("Опублікувати цю правку на сайті?")) return;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        try {
            const res = await fetch(`${baseUrl}/api/articles/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Правку успішно опубліковано!");
                setPendingEdits(prev => prev.filter(edit => edit.id !== id));
            } else {
                alert("Помилка при затвердженні.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!window.confirm("Назавжди видалити цей запит на правку?")) return;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        try {
            const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPendingEdits(prev => prev.filter(edit => edit.slug !== slug));
            } else {
                alert("Помилка при видаленні.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 space-y-8 overflow-hidden">
                    <div className="bg-[#A01E36] px-6 py-4 shadow-sm flex items-center justify-between">
                        <h1 className="text-white text-2xl font-bold italic">Нерозглянуті правки</h1>
                        <Link href="/profile" className="text-white/80 text-sm hover:underline cursor-pointer">
                            ← Повернутися до кабінету
                        </Link>
                    </div>

                    <div className="border border-dark-color-bar/20 rounded-sm bg-white shadow-sm p-6">
                        {loading ? (
                            <p className="text-center italic text-gray-500 animate-pulse">Завантаження запитів...</p>
                        ) : pendingEdits.length === 0 ? (
                            <div className="text-center py-10">
                                <span className="text-4xl mb-4 block">✅</span>
                                <p className="italic text-gray-500">Усі правки перевірено. Немає нових запитів.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingEdits.map((edit) => (
                                    <div key={edit.id} className="border border-brand-border/50 p-4 bg-[#F8FAFC] rounded-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                        <div>
                                            <h3 className="font-bold text-website-name text-lg">{edit.title}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                                Автор: <span className="font-bold">{edit.author}</span> • Slug: {edit.slug}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 shrink-0">
                                            {/* Кнопка перегляду (можна направити на чернетку) */}
                                            <Link
                                                href={`/article/${edit.slug}`}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 text-[11px] uppercase tracking-wider font-bold transition-colors"
                                            >
                                                Переглянути
                                            </Link>

                                            <button
                                                onClick={() => handleApprove(edit.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-[11px] uppercase tracking-wider font-bold shadow-sm transition-colors cursor-pointer"
                                            >
                                                Затвердити
                                            </button>

                                            <button
                                                onClick={() => handleDelete(edit.slug)}
                                                className="bg-[#A01E36] hover:bg-[#8A192E] text-white px-4 py-2 text-[11px] uppercase tracking-wider font-bold shadow-sm transition-colors cursor-pointer"
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}