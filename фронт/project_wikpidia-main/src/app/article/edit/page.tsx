"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'; // роутер для перенаправлення
import { articleService } from '@/services/api';
// динамічний імпорт Quill з патчем сумісності під Quill 2.0
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        if (typeof window !== 'undefined') {
            const Quill = RQ.Quill;
            if (Quill) {
                const Parchment = Quill.import('parchment');
                if (Parchment && !(Quill as any).Attributor) {
                    (Quill as any).Attributor = Parchment.Attributor || {};
                    (Quill as any).Attributor.Class = Parchment.ClassAttributor || {};
                    (Quill as any).Attributor.Style = Parchment.StyleAttributor || {};
                }
                (window as any).Quill = Quill;
            }
        }
        const { default: ImageResize } = await import("quill-image-resize-module-react");
        if (RQ.Quill) {
            RQ.Quill.register("modules/imageResize", ImageResize);
        }
        return RQ;
    },
    {
        ssr: false,
        loading: () => <div className="h-[400px] bg-light-color-bar animate-pulse rounded-sm" />
    }
);

import 'react-quill-new/dist/quill.snow.css';

export default function EditArticlePage() {
    const router = useRouter(); // Ініціалізуємо роутер

    // стандартні стани форми пошуку
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [comment, setComment] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // стан деактивації кнопки при відправці

    const quillModulesRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);

        quillModulesRef.current = {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'blockquote'],
                    ['image'],
                    [{ 'align': [] }],
                    ['clean']
                ],
                handlers: {
                    image: function (this: any) {
                        const url = prompt('Введіть URL-адресу зображення:');
                        if (!url) return;

                        const caption = prompt('Введіть опис зображення (для відображення під ним у рамці):');
                        const quill = this.quill;
                        const range = quill.getSelection();

                        quill.insertEmbed(range.index, 'image', url);

                        if (caption && caption.trim() !== "") {
                            quill.formatText(range.index, 1, 'alt', caption);
                        }
                        quill.setSelection(range.index + 1);
                    }
                }
            },
            imageResize: {
                modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
        };
    }, []);

    // ФУНКЦІЯ ОБРОБКИ ПУБЛІКАЦІЇ СТАТТІ
    const handlePublish = async () => {
        if (!title.trim()) {
            alert("Помилка: Назва статті обов'язкова.");
            return;
        }
        if (!content.trim() || content === "<p><br></p>") {
            alert("Помилка: Контент не може бути порожнім.");
            return;
        }

        setIsSubmitting(true);

        try {
            // ЗАСТОСУВАННЯ ФУНКЦІЇ СЕРВІСУ: замість 20 рядків fetch — один рядок сервісу
            const data = await articleService.createArticle(title, content, comment);

            const articleSlug = data.slug || data.id;
            alert("Статтю успішно опубліковано!");
            router.push(`/article/${articleSlug}`);

        } catch (error) {
            console.error("Publish error:", error);
            alert("Критична помилка відправки. Перевірте підключення до бекенду.");
        } finally {
            setIsSubmitting(false);
        }
    };
    // функція-парсер рамок для попереднього перегляду
    const renderContentWithCaptions = (htmlString: string) => {
        if (typeof window === 'undefined' || !htmlString) return htmlString;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const images = doc.querySelectorAll('img');

        images.forEach(img => {
            const altText = img.getAttribute('alt');
            const originalStyle = img.getAttribute('style') || '';
            const parentParagraph = img.closest('p');
            const isParentCentered = parentParagraph?.classList.contains('ql-align-center');
            const isParentRight = parentParagraph?.classList.contains('ql-align-right');

            if (altText && altText.trim() !== "" && !altText.includes('data:image')) {
                const container = doc.createElement('div');
                const caption = doc.createElement('div');

                if (originalStyle.includes('float: right') || isParentRight) {
                    container.className = "wiki-thumb-container float-right m-4 ml-6 mr-0 max-w-[300px] block";
                } else if (originalStyle.includes('margin: auto') || isParentCentered) {
                    container.className = "wiki-thumb-container mx-auto my-4 max-w-[400px] block text-center";
                } else if (originalStyle.includes('float: left')) {
                    container.className = "wiki-thumb-container float-left m-4 mr-6 ml-0 max-w-[300px] block";
                } else {
                    container.className = "wiki-thumb-container my-4 inline-block max-w-[300px]";
                }

                img.style.float = 'none';
                img.style.margin = '0';
                img.className = "w-full h-auto object-contain";

                caption.className = "wiki-thumb-caption";
                caption.textContent = altText;

                img.parentNode?.insertBefore(container, img);
                container.appendChild(img);
                container.appendChild(caption);
            } else {
                if (originalStyle.includes('float: right') || isParentRight) {
                    img.className = "float-right m-4 ml-6 mr-0 border border-dark-color-bar/10 p-1 bg-brand-border/10";
                } else if (originalStyle.includes('margin: auto') || isParentCentered) {
                    img.className = "block mx-auto my-4 border border-dark-color-bar/10 p-1 bg-brand-border/10";
                } else if (originalStyle.includes('float: left')) {
                    img.className = "float-left m-4 mr-6 ml-0 border border-dark-color-bar/10 p-1 bg-brand-border/10";
                }
            }
        });

        return doc.body.innerHTML;
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 overflow-hidden">

                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            {showPreview ? "Попередній перегляд статті" : "Редагування статті"}
                        </h1>
                    </div>

                    {!showPreview ? (
                        <>
                            {/* ДОДАНО: ПОЛЕ ЗАГОЛОВКА СТАТТІ */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden mb-6">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Заголовок статті</div>
                                <div className="p-4 bg-brand-border/5">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Введіть назву статті (наприклад: Архітектура клієнт-серверних систем)..."
                                        className="w-full p-2 bg-white border border-dark-color-bar/20 outline-none text-sm font-bold text-main-text italic placeholder:text-main-text/40"
                                    />
                                </div>
                            </div>

                            {/* ТЕКСТОВИЙ РЕДАКТОР */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden mb-6">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Текстовий редактор</div>
                                <div className="bg-white">
                                    {quillModulesRef.current && (
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={quillModulesRef.current}
                                            className="h-[400px] mb-12"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* КОМЕНТАР АВТОРА */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden mb-6 mt-16">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Коментар автора (Опис ревізії)</div>
                                <div className="p-4 bg-brand-border/20">
                                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коротко про внесені зміни..." className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none italic" />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* БЛОК ПОПЕРЕДНЬОГО ПЕРЕГЛЯДУ */
                        <div className="p-4 md:p-8 border-2 border-brand-border bg-white min-h-[500px] w-full max-w-full overflow-hidden rounded-sm text-sm">
                            <h1 className="text-3xl font-bold mb-4 italic text-website-name border-b border-dark-color-bar/30 pb-2">
                                {title || "Без назви"}
                            </h1>
                            <div
                                className="wiki-preview-content"
                                dangerouslySetInnerHTML={{ __html: renderContentWithCaptions(content) }}
                            />
                        </div>
                    )}

                    {/* КНОПКИ ДІЙ */}
                    <div className="flex flex-wrap gap-4 mt-8">
                        {/* ОНОВЛЕНО: Кнопка отримала обробник і стан блокування */}
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="bg-search-button hover:bg-website-name text-white px-8 py-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Публікація..." : "Опублікувати"}
                        </button>

                        <button onClick={() => setShowPreview(!showPreview)} className="bg-search-button hover:bg-website-name text-white px-8 py-2 font-bold transition-colors">
                            {showPreview ? "Повернутись до редагування" : "Попередній перегляд"}
                        </button>
                        <button onClick={() => router.push('/profile')} className="bg-[#A01E36] hover:bg-[#80182B] text-white px-8 py-2 font-bold transition-colors">Скасувати</button>
                    </div>
                </main>
            </div>
        </div>
    );
}