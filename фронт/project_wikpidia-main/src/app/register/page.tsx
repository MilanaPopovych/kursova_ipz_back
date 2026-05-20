"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { user } = useAuth();
    // локальні стани
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // сис. стани
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // захищаємо маршрут і перенаправляємо авторизованого користувача в кабінет
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);
    // обробник відправки форми реєстрації
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        // первинна клієнтська валідація заповнення полів
        if (!fullName.trim() || !email.trim() || !username.trim() || !password.trim()) {
            setError("Будь ласка, заповніть усі обов'язкові поля.");
            return;
        }
        // валідація збігу паролів перед відправкою на Spring Boot
        if (password !== confirmPassword) {
            setError("Паролі не збігаються. Перевірте правильність введення.");
            return;
        }
        // перевірка довжини пароля
        if (password.length < 10) {
            setError("Пароль має бути не менше 10 символів.");
            return;
        }
        setIsSubmitting(true);

        try {
            // post запит
            await authService.register({
                username: username.trim(),
                fullName: fullName.trim(),
                email: email.trim(),
                password: password
            });
            alert("Обліковий запис успішно створено в системі! Тепер ви можете увійти.");
            // перенаправлення користувача на сторінку входу
            router.push('/login');
        } catch (err: any) {
            console.error("Registration component error:", err);
            // виводимо повідомлення, якщо email або нікнейм уже зайняті в PostgreSQL
            setError(err.message || "Помилка реєстрації. Перевірте правильність даних або спробуйте інший нікнейм.");
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
                    <div className="w-full max-w-md border border-dark-color-bar/20 rounded-sm overflow-hidden shadow-xs bg-white my-4">
                        {/* заголовок */}
                        <div className="bg-dark-color-bar px-6 py-3 text-white font-bold italic text-md flex items-center gap-2 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                fill="currentColor"
                                className="w-5 h-5 shrink-0 text-white"
                            >
                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 513.1 24.9 538 55.7 538l256.6 0c-4.1-13.3-6.3-27.4-6.3-42c0-59.8 34.2-111.6 84.3-137.1c-14.9-10.4-33-16.9-52.7-16.9l-113.1 0c-15.6 0-31.1 2.3-46 6.9zM568 432l-32 0 0-32c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 32-32 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l32 0 0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 32 0c-13.3 0-24-10.7-24-24s-10.7-24-24-24z"/>
                            </svg>
                            <span>Реєстрація у системі WiKPIdia</span>
                        </div>
                        {/* тіло форми реєстрації */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            {/* поле ПІБ */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Повне ім'я (ПІБ)
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                    placeholder="Наприклад: Шевченко Тарас Григорович"
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/30 focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* поле ел.пошти */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Електронна пошта
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    placeholder="username@edu.kpi.ua"
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/30 focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* поле нікнейму */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Обрати нікнейм (Username)
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    placeholder="Наприклад: shevchenko_taras"
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/30 focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* поле пароля */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Пароль
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    placeholder="Мінімум 10 символів..."
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* поле повторення пароля */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-main-text uppercase tracking-wide italic">
                                    Повторіть пароль
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm focus:border-search-button/40 transition-colors"
                                    required
                                />
                            </div>
                            {/* кнопка створення акаунту */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-search-button hover:bg-website-name text-white font-bold py-2.5 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-2xs"
                                >
                                    {isSubmitting ? "Реєстрація на сервері..." : "Створити обліковий запис"}
                                </button>
                            </div>
                            {/* перехід назад до авторизації */}
                            <div className="text-center pt-2 border-t border-dark-color-bar/10 text-xs italic text-gray-500">
                                Вже зареєстровані в системі?{" "}
                                <Link href="/login" className="text-website-links hover:underline font-bold not-italic ml-1">
                                    Авторизуватися →
                                </Link>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}