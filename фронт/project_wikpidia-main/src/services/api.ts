const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const articleService = {
    // функція створення статті
    async createArticle(title: string, content: string, comment: string) {
        const response = await fetch(`${BASE_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, comment })
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },

    // функція отримання статті за її slug
    async getArticleBySlug(slug: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}`);
        if (!response.ok) throw new Error('Article not found');
        return response.json();
    },

    // збереження статті користувачем до профіля
    async saveArticleToProfile(slug: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/users/saved-articles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleSlug: slug })
        });
        if (!response.ok) throw new Error('не вдалося зберегти статтю в особистому кабінеті.');
        return response.json();
    },

    // видалення статті (тільки для адмінів)
    async deleteArticle(slug: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Не вдалося видалити статтю. Доступ заборонено або ресурс відсутній.');
        return response;
    },

    // прив'язка статті до категорії (POST)
    async assignCategory(articleSlug: string, categoryId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${articleSlug}/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryId })
        });
        if (!response.ok) throw new Error('Помилка прив\'язки до категорії');
        return response.json();
    },

    // вилучення статті з категорії (DELETE)
    async removeCategory(articleSlug: string, categoryId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${articleSlug}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Помилка вилучення з категорії');
        return response;
    },

    // отримання всіх тем обговорення для статті
    async getDiscussionTopics(slug: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/discussions`);
        if (!response.ok) throw new Error('Не вдалося завантажити теми обговорення');
        return response.json();
    },

    // створення нової теми/коментаря в обговоренні (З ОНОВЛЕНИМ authorName)
    async createDiscussionTopic(slug: string, topicTitle: string, commentContent: string, authorName: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/discussions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: topicTitle, content: commentContent, author: authorName })
        });
        if (!response.ok) throw new Error('Помилка створення теми. Можливо, сесія застаріла.');
        return response.json();
    },

    // видалення теми/коментаря (для адмінів)
    async deleteDiscussionTopic(slug: string, topicId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/discussions/${topicId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Не вдалося видалити коментар');
        return response;
    },

    // створення нової категорії (тільки для адмінів)
    async createCategory(categoryName: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: categoryName })
        });

        if (!response.ok) throw new Error('Не вдалося створити категорію. Перевірте права доступу.');
        return response.json();
    },

    // ДОДАНО: видалення категорії за ID (тільки для адмінів)
    async deleteCategory(categoryId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Не вдалося видалити категорію. Можливо, вона пов\'язана з іншими об\'єктами.');
        return response;
    }
};