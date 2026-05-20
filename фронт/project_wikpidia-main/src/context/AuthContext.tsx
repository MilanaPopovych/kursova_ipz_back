"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: any | null;
    token: string | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // при першому завантаженні сайту перевіряємо, чи є вже збережений токен у браузері
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('wikpidia_token');
            const storedUser = localStorage.getItem('wikpidia_user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
    }, []);

    const login = (userData: any, jwtToken: string) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('wikpidia_token', jwtToken);
        localStorage.setItem('wikpidia_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('wikpidia_token');
        localStorage.removeItem('wikpidia_user');
        window.location.href = '/'; // Повертаємо на головну сторінку
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
// кастомний хук для швидкого доступу до авторизації у компонентах
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth має використовуватися виключно всередині AuthProvider');
    }
    return context;
}