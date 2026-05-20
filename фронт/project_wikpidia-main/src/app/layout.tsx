import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import ConditionalFooter from "@/components/CustomFooter";
import { AuthProvider } from "@/context/AuthContext"; // Імпортуємо провайдер контексту безпеки
import "./globals.css";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin", "cyrillic"],
    weight: ["400", "700"],
    style: ["italic", "normal"],
});

export const metadata: Metadata = {
    title: "Онлайн-Енциклопедія",
    description: "Університетська база знань",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="uk"
            className={`${playfair.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col font-serif">
        {/* обгортка додатку в AuthProvider для глобального доступу до сесії користувача */}
        <AuthProvider>
            <div className="flex-grow flex flex-col">
                {children}
            </div>
            {/* футер з'явиться на всіх сторінках, крім головної та "про проєкт" */}
            <ConditionalFooter />
        </AuthProvider>
        </body>
        </html>
    );
}