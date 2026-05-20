package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    // Record для безпечного приймання даних з фронтенду
    public record ArticleRequest(String title, String content, String comment) {}

    // 1. ЧИТАННЯ ВСІХ: Отримати всі опубліковані статті (для головної сторінки)
    @GetMapping
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }

    // 2. ЧИТАННЯ ОДНІЄЇ: Отримання статті за її SLUG
    @GetMapping("/{slug}")
    public Article getArticleBySlug(@PathVariable String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено"));
    }

    // 3. СТВОРЕННЯ: Додати нову статтю (За замовчуванням йде на модерацію)
    @PostMapping
    public Article createArticle(@RequestBody ArticleRequest request) {
        Article article = new Article();
        article.setTitle(request.title());
        article.setContent(request.content());
        article.setComment(request.comment());

        // Автоматично генеруємо унікальний латинський URL з назви
        article.setSlug(generateSlug(request.title()));

        // Важливо: стаття стає неактивною, поки її не затвердить адмін
        article.setIsPublished(false);

        // Підхоплюємо автора, який зараз авторизований на сайті
        String activeUsername = AuthController.currentSessionUser;
        if (activeUsername != null && !activeUsername.isEmpty()) {
            article.setAuthor(activeUsername);
        } else {
            article.setAuthor("Анонім");
        }

        // Базові значення для нових статей
        article.setVersion("1.0");

        return articleRepository.save(article);
    }

    // 4. МОДЕРАЦІЯ (СПИСОК): Отримати всі нерозглянуті правки (ТІЛЬКИ ДЛЯ АДМІНІСТРАТОРА)
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingArticles() {
        String activeUsername = AuthController.currentSessionUser;
        User currentUser = activeUsername != null ? userRepository.findByUsername(activeUsername).orElse(null) : null;

        // Перевірка прав доступу
        if (currentUser == null || !("Адміністратор".equals(currentUser.getRole()) || "Адмін".equals(currentUser.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено! Тільки адміністратори можуть переглядати правки."));
        }

        List<Article> pendingArticles = articleRepository.findByIsPublishedFalse();
        return ResponseEntity.ok(pendingArticles);
    }

    // 5. МОДЕРАЦІЯ (ЗАТВЕРДЖЕННЯ): Опублікувати статтю за її ID
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveArticle(@PathVariable Long id) {
        String activeUsername = AuthController.currentSessionUser;
        User currentUser = activeUsername != null ? userRepository.findByUsername(activeUsername).orElse(null) : null;

        if (currentUser == null || !("Адміністратор".equals(currentUser.getRole()) || "Адмін".equals(currentUser.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено!"));
        }

        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Статтю для затвердження не знайдено."));
        }

        // Міняємо прапорець і стаття стає видимою для всіх
        article.setIsPublished(true);
        articleRepository.save(article);

        return ResponseEntity.ok(Map.of("message", "Правку успішно опубліковано на сайті!"));
    }

    // 6. ВИДАЛЕННЯ / ВІДХИЛЕННЯ ПРАВКИ: Видалити статтю за її SLUG
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deleteArticle(@PathVariable String slug) {
        String activeUsername = AuthController.currentSessionUser;
        User currentUser = activeUsername != null ? userRepository.findByUsername(activeUsername).orElse(null) : null;

        if (currentUser == null || !("Адміністратор".equals(currentUser.getRole()) || "Адмін".equals(currentUser.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено!"));
        }

        Article article = articleRepository.findBySlug(slug).orElse(null);
        if (article == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Статтю не знайдено."));
        }

        articleRepository.delete(article);
        return ResponseEntity.ok(Map.of("message", "Статтю успішно видалено/відхилено модератором."));
    }

    // ---------------------------------------------------------
    // ДОПОМІЖНИЙ МЕТОД: Автоматична генерація URL (слагу)
    // ---------------------------------------------------------
    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return "article-" + System.currentTimeMillis();
        }

        String slug = title.toLowerCase();

        // Транслітерація українського алфавіту
        String[] ukr = {"а", "б", "в", "г", "ґ", "д", "е", "є", "ж", "з", "и", "і", "ї", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ю", "я"};
        String[] lat = {"a", "b", "v", "h", "g", "d", "e", "ie", "zh", "z", "y", "i", "yi", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "f", "kh", "ts", "ch", "sh", "shch", "", "iu", "ia"};

        for (int i = 0; i < ukr.length; i++) {
            slug = slug.replace(ukr[i], lat[i]);
        }

        slug = slug.replaceAll("[^a-z0-9\\s-]", "");
        slug = slug.replaceAll("\\s+", "-");
        slug = slug.replaceAll("-+", "-");

        return slug + "-" + (System.currentTimeMillis() % 10000);
    }
}