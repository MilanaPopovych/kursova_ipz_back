"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function CustomFooter() {
    const pathname = usePathname();
    // Список шляхів, де футер не потрібен
    const excludedPaths = ["/", "/about"];
    const showFooter = !excludedPaths.includes(pathname);

    return showFooter ? <Footer /> : null;
}