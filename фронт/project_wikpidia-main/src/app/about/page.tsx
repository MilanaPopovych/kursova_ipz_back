import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center min-h-screen bg-white p-4 md:p-8 font-serif">
            {/* заголовок і логотип */}
            <div className="text-center mb-8">
                <h1 className="text-website-name text-3xl md:text-4xl font-bold italic mb-4">
                    Інформація про проєкт
                </h1>
                <Link
                    href="/"
                    className="inline-block group transition-transform duration-300 hover:scale-110 active:scale-95"
                    title="Повернутися на головну сторінку"
                >
                    <img
                        src="/logo_blue.svg"
                        alt="WiKPIdia Logo"
                        className="w-32 h-32 mx-auto object-contain cursor-pointer
                        drop-shadow-sm group-hover:drop-shadow-md"
                    />
                </Link>
            </div>
            {/* основний контент */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12
            bg-brand-border/30 p-8 rounded-sm">
                {/* автори проєкту (зліва) */}
                <div>
                    <h2 className="text-website-name text-2xl font-bold italic mb-8">
                        Автори проєкту:
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                        {/* Шеремета */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-40 bg-light-color-bar flex items-center justify-center mb-4 border border-dark-color-bar/20">
                            </div>
                            <p className="text-main-text font-bold leading-tight mb-1">
                                Шеремета Артем <br/> Русланович
                            </p>
                            <p className="text-main-text/70 text-sm italic mb-3">
                                Backend розробка, <br/> база даних
                            </p>
                            {/* блок з посиланням та іконками */}
                            <div className="flex gap-4">
                                {/* Telegram */}
                                <a
                                    href="https://t.me/Termenatofof"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Telegram"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                                    </svg>
                                </a>
                                {/* email */}
                                <a
                                    href="mailto:sheremeta.a.r.-io46@edu.kpi.ua"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Ел. адреса Gmail"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </a>
                                {/* телефон */}
                                <a
                                    href="tel:+380993861361"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Зателефонувати"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                </a>

                            </div>
                        </div>

                        {/* Попович */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-40 bg-light-color-bar flex items-center justify-center
                            mb-4 border border-dark-color-bar/20">
                            </div>
                            <p className="text-main-text font-bold leading-tight mb-1">
                                Попович Мілана <br/> Олександрівна
                            </p>
                            <p className="text-main-text/70 text-sm italic mb-3">
                                Frontend розробка
                            </p>
                            {/* блок з посиланням та іконками */}
                            <div className="flex gap-4">
                                {/* Telegram */}
                                <a
                                    href="https://t.me/deepseacritter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Telegram"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                                    </svg>
                                </a>
                                {/* email */}
                                <a
                                    href="mailto:popovych.m.o.-io46@edu.kpi.ua"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Ел. адреса Gmail"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </a>
                                {/* телефон */}
                                <a
                                    href="tel:+380983615133"
                                    className="text-search-button hover:text-website-name transition-colors"
                                    title="Зателефонувати"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
                {/* інформаційні блоки */}
                <div className="space-y-10">
                    <section>
                        <h2 className="text-website-name text-2xl font-bold italic mb-2"> Мета проєкту: </h2>
                        <p className="text-main-text">
                            Створення інтерактивної університетської енциклопедії для структурування
                            та швидкого пошуку знань спільноти КПІ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-website-name text-2xl font-bold italic mb-2"> Технологічний стек: </h2>
                        <p className="text-main-text">
                            Next.js, Spring Boot, PostgreSQL, Tailwind CSS.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-website-name text-2xl font-bold italic mb-2"> Версія проєкту: </h2>
                        <p className="text-main-text"> v1.0.46-beta </p>
                    </section>
                </div>
            </div>
            {/* футер інф. сторінки */}
            <footer className="mt-auto py-8 w-full max-w-6xl flex justify-between text-website-links font-bold italic text-lg">
                <Link href="/search" className="hover:underline">Пошук</Link>
                <Link href="/" className="hover:underline">Головна сторінка</Link>
                <Link href="https://library.kpi.ua" className="hover:underline">Бібліотека КПІ</Link>
                <Link href="https://kpi.ua" className="hover:underline">Офіційний сайт КПІ</Link>
            </footer>

        </main>
    );
}