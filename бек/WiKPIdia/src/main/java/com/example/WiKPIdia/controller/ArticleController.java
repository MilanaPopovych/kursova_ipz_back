package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public record ArticleRequest(String title, String content, String comment) {}

    // =========================================================================
    // ДОПОМІЖНІ МЕТОДИ (СИСТЕМА БЕЗПЕКИ)
    // =========================================================================

    private String getActiveUsernameSafely() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String activeUsername = null;

        if (principal instanceof UserDetails) {
            activeUsername = ((UserDetails) principal).getUsername();
        } else if (principal != null && !"anonymousUser".equals(principal.toString())) {
            activeUsername = principal.toString();
        }

        if (activeUsername == null && AuthController.currentSessionUser != null && !AuthController.currentSessionUser.isEmpty()) {
            activeUsername = AuthController.currentSessionUser;
        }

        if (activeUsername == null || activeUsername.isEmpty() || "anonymousUser".equals(activeUsername)) {
            activeUsername = AuthController.currentSessionUser;
        }

        return activeUsername;
    }

    private boolean isAdmin(User user) {
        if (user == null || user.getRole() == null) return false;
        String role = user.getRole().trim();
        return role.equalsIgnoreCase("Адміністратор") || role.equalsIgnoreCase("Адмін");
    }

    // =========================================================================
    // ОСНОВНІ ЕНДПОІНТИ (API)
    // =========================================================================

    // 1. Отримати всі опубліковані статті
    @GetMapping
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }
    // Отримання статті за її SLUG
    @GetMapping("/{slug}")
    public ResponseEntity<?> getArticleBySlug(@PathVariable String slug) {
        java.util.Optional<Article> articleOptional = articleRepository.findBySlug(slug);
        if (articleOptional.isPresent()) {
            return ResponseEntity.ok(articleOptional.get());
        } else {
            return ResponseEntity.status(404).body("Статтю не знайдено за вказаною адресою (slug): " + slug);
        }
    }
    // Отримання всіх правок для статті
    @GetMapping("/{slug}/revisions")
    public ResponseEntity<?> getRevisions(@PathVariable String slug) {
        List<Article> revisions = articleRepository.findByOriginalArticleSlugAndIsPublishedFalse(slug);
        return ResponseEntity.ok(revisions);
    }

    // Створення нової статті
    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody Article article) {
        String activeUsername = getActiveUsernameSafely();

        article.setAuthor(activeUsername);

        String autoSlug = generateSlug(article.getTitle());
        article.setSlug(autoSlug);
        article.setIsPublished(false);

        // originalArticleSlug передається з фронтенду автоматично через @RequestBody

        try {
            articleRepository.save(article);
            return ResponseEntity.ok(Map.of(
                    "message", "Статтю успішно створено!",
                    "slug", autoSlug
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Internal Server Error",
                    "message", "Помилка при збереженні статті: " + e.getMessage()
            ));
        }
    }
    // Видалення статті (тільки для адміністратора)
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deleteArticle(@PathVariable String slug) {
        String activeUsername = getActiveUsernameSafely();
        User currentUser = userRepository.findByUsername(activeUsername).orElse(null);

        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено! Тільки Адміністратор може видаляти статті."));
        }

        Article article = articleRepository.findBySlug(slug).orElse(null);
        if (article == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Статтю не знайдено."));
        }

        articleRepository.delete(article);
        return ResponseEntity.ok(Map.of("message", "Статтю успішно видалено адміністратором."));
    }

    // Отримання правок на модерацію (тільки для адміністраторів)
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingEdits() {
        String activeUsername = getActiveUsernameSafely();
        User currentUser = userRepository.findByUsername(activeUsername).orElse(null);

        if (!isAdmin(currentUser)) {
            String role = (currentUser != null && currentUser.getRole() != null) ? currentUser.getRole() : "Невідомо";
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено! Ваша роль: " + role));
        }

        List<Article> pendingArticles = articleRepository.findByIsPublishedFalse();
        return ResponseEntity.ok(pendingArticles);
    }
    // Затвердження правки (тільки для адміністраторів)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveArticle(@PathVariable Long id) {
        String activeUsername = getActiveUsernameSafely();
        User currentUser = userRepository.findByUsername(activeUsername).orElse(null);

        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено!"));
        }

        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Правку не знайдено."));
        }

        // Якщо стаття вже була опублікована раніше — це правка
        if (Boolean.TRUE.equals(article.getIsPublished())) {
            article.setWasEdited(true);
        }

        article.setIsPublished(true);
        articleRepository.save(article);

        return ResponseEntity.ok(Map.of("message", "Правку успішно затверджено та опубліковано!"));
    }

    // =========================================================================
    // ТЕХНІЧНІ МЕТОДИ
    // =========================================================================

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return "article-" + System.currentTimeMillis();
        }

        String slug = title.toLowerCase();

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