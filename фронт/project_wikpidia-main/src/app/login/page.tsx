"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, user } = useAuth();
    // локальні стани форми
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // системні стани запиту
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Будь ласка, заповніть усі обов'язкові поля.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const data = await authService.login({ username, password });

            login(
                {
                    username: data.username,
                    role: data.role || "Користувач",
                    fullName: data.fullName || "Користувач WiKPIdia"
                },
                data.token
            );

            router.push('/profile');
        } catch (err: any) {
            console.error("Login component error:", err);
            setError(err.message || "Неправильний логін або пароль. Спробуйте ще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 flex items-center justify-center overflow-hidden bg-brand-border/5">
                    <div className="w-full max-w-md border border-dark-color-bar/20 rounded-sm overflow-hidden shadow-xs bg-white">
                        {/* заголовок форми */}
                        <div className="bg-dark-color-bar px-6 py-3 text-white font-bold italic text-md flex items-center gap-2 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                fill="currentColor"
                                className="w-5 h-5 shrink-0 text-white"
                            >
                                <path d="M400 416C497.2 416 576 337.2 576 240C576 142.8 497.2 64 400 64C302.8 64 224 142.8 224 240C224 258.7 226.9 276.8 232.3 293.7L71 455C66.5 459.5 64 465.6 64 472L64 552C64 565.3 74.7 576 88 576L168 576C181.3 576 192 565.3 192 552L192 512L232 512C245.3 512 256 501.3 256 488L256 448L296 448C302.4 448 308.5 445.5 313 441L346.3 407.7C363.2 413.1 381.3 416 400 416zM440 160C462.1 160 480 177.9 480 200C480 222.1 462.1 240 440 240C417.9 240 400 222.1 400 200C400 177.9 417.9 160 440 160z"/>
                            </svg>
                            <span>Вхід до системи WiKPIdia</span>
                        </div>
                        {/* тіло форми */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* вікно помилки */}
                            {error && (
                                <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-3 text-xs italic text-[#A01E36] rounded-r-xs animate-in fade-in duration-200 flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640"
                                        fill="currentColor"
                                        className="w-4 h-4 shrink-0 mt-0.5 text-[#A01E36]"
                                    >
                                        <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}
                            {/* блок введення нікнейму */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Ім'я користувача (Нікнейм)
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    placeholder="Наприклад: milana_popovych"
                                    className="w-full p-2.5 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/30 focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* блок введення пароля */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Пароль доступу
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full p-2.5 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* кнопка відправки форми */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-search-button hover:bg-website-name text-white font-bold py-2.5 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-2xs"
                                >
                                    {isSubmitting ? "Перевірка даних..." : "Увійти в кабінет"}
                                </button>
                            </div>
                            {/* перехід до реєстрації */}
                            <div className="text-center pt-3 border-t border-dark-color-bar/10 text-xs italic text-gray-500">
                                Ще не маєте облікового запису?{" "}
                                <Link href="/register" className="text-website-links hover:underline font-bold not-italic ml-1">
                                    Створити акаунт →
                                </Link>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}