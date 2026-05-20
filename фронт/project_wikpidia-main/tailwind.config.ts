import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'website-name': '#0A4CA2',
                'website-subtitle': '#000000',
                'light-color-bar': '#DEF0FF',
                'dark-color-bar': '#8FC0FF',
                'search-button': '#5A8DD0',
                'main-text': '#1E569F',
                'brand-border': '#F8FCFF',
                'website-links': '#508EDE',
                'cancel-button': '#9F1E40'
            },
            fontFamily: {
                playfair: ["var(--font-playfair)", "serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
        },
    },
    plugins: [],
};

export default config;