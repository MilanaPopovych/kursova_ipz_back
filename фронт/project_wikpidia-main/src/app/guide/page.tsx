"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function GuidePage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Функція для плавного скролу до FAQ
    const scrollToFAQ = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('faq-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8">
                    {/* ГОРІШНЯ ПАНЕЛЬ ЗАГОЛОВКА */}
                    <div className="bg-search-button px-6 py-4 mb-8 shadow-sm flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full text-search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-white text-2xl font-bold italic uppercase tracking-wider">Довідка</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* ОСНОВНИЙ КОНТЕНТ */}
                        <div className="flex-grow space-y-12">

                            {/* Секція 1: Початок роботи */}
                            <section>
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex items-center gap-2 mb-4">
                                    <span className="text-lg">1.</span> Початок роботи
                                </div>
                                <div className="p-6 bg-brand-border/10 border border-dark-color-bar/10 rounded-sm space-y-4 leading-relaxed">
                                    <p>
                                        <strong>WiKPIdia</strong> — це університетська база знань, побудована за архітектурою MVC. Для повноцінної взаємодії вам необхідно пройти процес реєстрації.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong><em>Навігація:</em></strong> Використовуйте дерево категорій у бічному меню зліва для перегляду сторінок:
                                            <ul className="list-disc pl-10">
                                                <li><em>Головна сторінка</em> для переходу на домашню сторінку.</li>
                                                <li><em>Про проєкт</em>: інформаційна сторінка з відомостями про авторів, мету проєкту, версію тощо.</li>
                                                <li><em>Усі категорії</em>: сторінка для пошуку всіх категорій енциклопедії.</li>
                                                <li><em>Обговорення</em>: обговорення створеної статті.</li>
                                            </ul>
                                        </li>
                                        <li><strong><em>Пошук:</em></strong> Вбудований живий пошук у шапці дозволяє миттєво знайти потрібний термін за назвою або ключовими словами.</li>
                                        <li><strong><em>Автентифікація:</em></strong> Після входу ви отримаєте доступ до особистого кабінету, де зберігається історія ваших правок. </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Секція 2: Редагування та створення */}
                            <div className="border border-dark-color-bar/20 overflow-hidden">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex items-center gap-2">
                                    <span className="text-lg">2.</span> Редагування та створення
                                </div>
                                <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden shadow-md">
                                    <div className="bg-light-color-bar px-6 py-3 text-website-links font-bold italic text-lg uppercase tracking-wide">
                                        Інструкція редактора
                                    </div>
                                    <div className="p-8 bg-white space-y-8">
                                        <section>
                                            <h4 className="text-main-text font-bold italic border-b-2 border-brand-border w-fit mb-3">Робота з текстом</h4>
                                            <p className="leading-relaxed">
                                                Використовуйте панель інструментів для виділення <strong>жирним</strong> або <em>курсивом</em>. Пам'ятайте, що заголовки розділів (H1, H2) створюються автоматично при виборі формату в редакторі.
                                            </p>
                                        </section>

                                        <section>
                                            <h4 className="text-main-text font-bold italic border-b-2 border-brand-border w-fit mb-3">Мультимедіа та зображення</h4>
                                            <p className="leading-relaxed">
                                                Для завантаження фото натисніть іконку зображення {" "}
                                                <img
                                                    src="/small_image_icon.png"
                                                    alt="image_icon"
                                                    className="inline bg-transparent"/>
                                                . Ви можете змінювати розмір картинки, тягнучи за кути. Для створення "Вікі-рамки" виберіть вирівнювання (ліворуч або праворуч) – рамка додасться автоматично.
                                            </p>
                                        </section>

                                        <section className="bg-brand-border/20 p-4 border-l-4 border-search-button">
                                            <p className="italic font-bold text-main-text">
                                                ВАЖЛИВО: Обов'язково додавайте "Коментар автора" перед публікацією. Це допоможе модераторам швидше перевірити вашу правку.
                                            </p>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Секція 3: Спільнота та обговорення */}
                            <section>
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex items-center gap-2 mb-4">
                                    <span className="text-lg">3.</span> Спільнота та взаємодія
                                </div>
                                <div className="p-6 bg-brand-border/10 border border-dark-color-bar/10 rounded-sm space-y-4 leading-relaxed">
                                    <p>
                                        Основою нашої енциклопедії є спільна робота. Ми використовуємо багаторівневу рольову модель для підтримки якості контенту.
                                        <br/>
                                        Для взаємодії з іншими учасниками спільноти необхідна попередня реєстрація.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 border border-brand-border shadow-sm">
                                            <h4 className="font-bold italic text-website-name mb-2">Обговорення статей</h4>
                                            <p>Використовуйте вкладку "Обговорення" для пропозицій щодо змін. Це допомагає уникнути помилок при редагуванні у статтях.</p>
                                        </div>
                                        <div className="bg-white p-4 border border-brand-border shadow-sm">
                                            <h4 className="font-bold italic text-website-name mb-2">Академічна етика</h4>
                                            <p>WiKPIdia – це науковий простір. Будьте ввічливими, спирайтесь на факти та обов'язково вказуйте джерела інформації.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Секція FAQ - ЧАСТІ ЗАПИТАННЯ */}
                            <section id="faq-section" className="scroll-mt-24">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic mb-4 uppercase">
                                    Поширені запитання (FAQ)
                                </div>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-dark-color-bar pl-4 py-2">
                                        <p className="font-bold text-website-name italic">Чи можливо редагувати статті анонімно?</p>
                                        <p className="text-main-text">Ні, для забезпечення академічної точності редагування доступне лише авторизованим користувачам КПІ.</p>
                                    </div>
                                    <div className="border-l-4 border-dark-color-bar pl-4 py-2">
                                        <p className="font-bold text-website-name italic">Як додати зображення до статті?</p>
                                        <p className="text-main-text">У візуальному редакторі натисніть іконку "Зображення". Ви зможете змінити його розмір та додати підпис.</p>
                                    </div>
                                    <div className="border-l-4 border-dark-color-bar pl-4 py-2">
                                        <p className="font-bold text-website-name italic">Куди звертатись у разі технічної помилки?</p>
                                        <p className="text-main-text">Скористайтесь формою зворотного зв'язку за
                                            <Link href="/guide/sandbox" className="text-website-links hover:underline font-bold"> посиланням.</Link>
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* ПРАВА ПАНЕЛЬ (Швидкі посилання) */}
                        <aside className="w-full lg:w-72">
                            <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm sticky top-24">
                                <div className="bg-brand-border p-3 text-center font-bold text-website-name border-b border-dark-color-bar/20 uppercase text-xs tracking-widest">
                                    Швидка навігація
                                </div>
                                <div className="bg-white p-4 space-y-4 text-sm italic">
                                    {/* ШВИДКЕ ПОСИЛАННЯ З ПЕРЕХОДОМ ДО FAQ */}
                                    <a
                                        href="#faq-section"
                                        onClick={scrollToFAQ}
                                        className="flex items-center gap-2 text-website-links hover:underline"
                                    >
                                        <span className="w-1.5 h-1.5 bg-search-button rounded-full"></span>
                                        Часті запитання (FAQ)
                                    </a>

                                    <Link href="https://kpi.ua" target="_blank" className="flex items-center gap-2 text-website-links hover:underline">
                                        <span className="w-1.5 h-1.5 bg-search-button rounded-full"></span>
                                        Сайт КПІ
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}