import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-light-color-bar/30 py-4 mt-auto border-t border-dark-color-bar/10">
            <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-between items-cente text-website-links font-bold italic text-sm md:text-base gap-4">
                <Link href="/about" className="hover:underline"> Про проєкт </Link>
                <Link href="/" className="hover:underline"> Головна сторінка </Link>
                <Link href="https://library.kpi.ua" target="_blank" className="hover:underline">Бібліотека КПІ </Link>
                <Link href="https://kpi.ua" target="_blank" className="hover:underline"> Офіційний сайт КПІ </Link>
            </div>
        </footer>
    );
}