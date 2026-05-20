"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ArticleTabsProps {
    slug: string;
}

export default function ArticleTabs({ slug }: ArticleTabsProps) {
    const pathname = usePathname();
    // визначаємо, яка вкладка зараз активна на основі URL
    const isViewActive = pathname === `/article/${slug}`;
    const isDiscussionActive = pathname === `/article/${slug}/discussion`;
    const isEditActive = pathname.includes('/edit');
    // спільні стилі для вкладок
    const baseTabStyle = "px-4 py-1.5 text-xs font-bold font-serif italic transition-all relative border-t border-x rounded-t-xs";
    const activeStyle = "bg-white border-dark-color-bar/20 text-website-name z-10 -mb-[1px]";
    const inactiveStyle = "bg-brand-border/40 border-transparent text-main-text/60 hover:text-website-name hover:bg-brand-border/10";

    return (
        <div className="flex items-center gap-1 border-b border-dark-color-bar/20 w-full mb-4">
            {/* вкладка читання статті */}
            <Link
                href={`/article/${slug}`}
                className={`${baseTabStyle} ${isViewActive ? activeStyle : inactiveStyle}`}
            >
                Стаття
            </Link>
            {/* вкладка обговорення */}
            <Link
                href={`/article/${slug}/discussion`}
                className={`${baseTabStyle} ${isDiscussionActive ? activeStyle : inactiveStyle}`}
            >
                Обговорення
            </Link>

            {/* вкладка редагування */}
            {/* передача slug як query-параметру */}
            <Link
                href={`/article/edit?slug=${slug}`}
                className={`${baseTabStyle} ${isEditActive ? activeStyle : inactiveStyle}`}
            >
                Редагувати
            </Link>
        </div>
    );
}