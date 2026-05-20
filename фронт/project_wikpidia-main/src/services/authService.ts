const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const authService = {
    // реєстрація нового користувача
    async register(userData: any) {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Помилка реєстрації. Можливо, нікнейм або email уже зайняті.');
        }
        return response.json();
    },
    // автентифікація
    async login(credentials: any) {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Неправильний логін або пароль.');
        }
        return response.json(); // Очікуємо пакет: { token: "...", username: "...", role: "..." }
    }
};