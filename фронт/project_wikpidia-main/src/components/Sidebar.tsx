"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const params = useParams();
    const slug = params?.slug as string | undefined;

    const { user } = useAuth();

    // Перевірка, чи є користувач Адміністратором
    const isPrivileged = user && (user.role === 'Адміністратор' || user.role === 'Адмін' || user.role === 'ADMIN' || user.role === 'Головний редактор');

    const menuItems = [
        { name: 'Головна сторінка', href: '/' },
        { name: 'Про проєкт', href: '/about' },
        { name: 'Усі категорії', href: '/category' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-brand-border/30 border-r border-dark-color-bar/10 min-h-screen p-6 hidden md:block">
            <nav className="space-y-6">

                {/* загальна навігація */}
                <div>
                    <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase tracking-wider">Навігація</h3>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-website-links hover:underline text-sm font-serif">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* серверні дії для авторизованих користувачів */}
                {user && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase tracking-wider">Дії</h3>
                        <ul className="space-y-3">

                            {/* Кнопка "Створити статтю" (для всіх авторизованих) */}
                            <li>
                                <Link
                                    href="/article/edit"
                                    className="text-search-button hover:text-website-name text-sm font-serif font-bold flex items-center gap-2 group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className="w-4 h-4 shrink-0 text-search-button group-hover:text-website-name transition-colors">
                                        <path d="M539.3 64.1C549.2 63.3 558.9 67.1 565.9 74.1C572.9 81.1 576.7 90.8 575.9 100.7C571.9 150 558.5 226.9 529.6 300.4C527.8 304.9 524.1 308.3 519.4 309.7L438.5 334C434.6 335.2 432 338.7 432 342.8C432 347.9 436.1 352 441.2 352L479.8 352C491.8 352 499.5 364.8 493.3 375.1C489.3 381.8 485 388.3 480.6 394.7C478.6 397.6 475.6 399.7 472.2 400.8L374.5 430C370.6 431.2 368 434.7 368 438.8C368 443.9 372.1 448 377.2 448L393.2 448C407.8 448 414.2 465.4 402 473.4C334 518.4 264.3 516.7 219.6 504.7C206.9 501.3 195.6 494.8 185.2 486.8L112 560C103.2 568.8 88.8 568.8 80 560C71.2 551.2 71.2 536.8 80 528L160 448L160.5 448.5C161.2 447.2 162.1 446 163.2 444.9L320 288C328.8 279.2 328.8 264.8 320 256C311.2 247.2 296.8 247.2 288 256L153.7 390.2C144.8 399.1 129.7 394.6 128.7 382C124.4 328.8 138 258.9 201.3 195.6C292.4 104.5 455.5 70.9 539.2 64.1z"/>
                                    </svg>
                                    <span>Створити статтю</span>
                                </Link>
                            </li>

                            {/* БЛОК ДЛЯ АДМІНІВ */}
                            {isPrivileged && (
                                <>
                                    <li>
                                        <Link
                                            href="/category/create"
                                            className="text-search-button hover:text-website-name text-sm font-serif font-bold flex items-center gap-2 group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-search-button group-hover:text-website-name transition-colors">
                                                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                                            </svg>
                                            <span>Створити категорію</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/pending"
                                            className="text-search-button hover:text-website-name text-sm font-serif font-bold flex items-center gap-2 group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-search-button group-hover:text-website-name transition-colors">
                                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                            </svg>
                                            <span>Модерація статей</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                {/* взаємодія (якщо відкрита конкретна стаття) */}
                {slug && (
                    <div className="animate-in fade-in duration-500 mt-6 pt-6 border-t border-dark-color-bar/10">
                        <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase tracking-wider">Взаємодія</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={`/article/${slug}/discussion`}
                                    className="text-website-links hover:underline text-sm font-bold flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 bg-search-button rounded-full"></span>
                                    Перейти до обговорення
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}

            </nav>
        </aside>
    );
}