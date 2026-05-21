package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.SavedArticle;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.SavedArticleRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final SavedArticleRepository savedArticleRepository;

    // =========================================================================
    // ДОПОМІЖНИЙ МЕТОД: Безпечне визначення поточного користувача
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

        return activeUsername;
    }

    // =========================================================================
    // ОТРИМАННЯ ПРОФІЛЮ
    // =========================================================================
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String activeUsername = getActiveUsernameSafely();

        if (activeUsername == null || "anonymousUser".equals(activeUsername)) {
            return ResponseEntity.status(401).body(Map.of("error", "Не авторизовано"));
        }

        User currentUser = userRepository.findByUsername(activeUsername).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Користувача не знайдено"));
        }

        Map<String, Object> userInfo = Map.of(
                "username", currentUser.getUsername(),
                "fullName", currentUser.getFullName() != null ? currentUser.getFullName() : "",
                "email", currentUser.getEmail() != null ? currentUser.getEmail() : "",
                "role", currentUser.getRole() != null ? currentUser.getRole() : "Користувач",
                "createdAt", currentUser.getCreatedAt() != null ? currentUser.getCreatedAt() : "Сьогодні"
        );

        // Нещодавні публікації користувача
        List<Article> userArticles = articleRepository.findByAuthor(activeUsername);
        List<Map<String, String>> recentPublications = new ArrayList<>();
        for (Article article : userArticles) {
            recentPublications.add(Map.of(
                    "id", String.valueOf(article.getId()),
                    "title", article.getTitle(),
                    "slug", article.getSlug() != null ? article.getSlug() : "",
                    "type", "Стаття",
                    "date", article.getCreatedAt() != null ? article.getCreatedAt() : "—"
            ));
        }

        // Збережені статті з перевіркою чи існують в базі
        List<SavedArticle> savedDbArticles = savedArticleRepository.findByUsernameOrderByIdDesc(activeUsername);
        List<Map<String, String>> savedArticles = new ArrayList<>();
        for (SavedArticle sa : savedDbArticles) {
            boolean articleExists = articleRepository.findBySlug(sa.getArticleSlug()).isPresent();
            if (articleExists) {
                savedArticles.add(Map.of(
                        "id", String.valueOf(sa.getId()),
                        "title", sa.getArticleTitle(),
                        "slug", sa.getArticleSlug(),
                        "savedAt", sa.getSavedAt()
                ));
            } else {
                savedArticleRepository.delete(sa);
            }
        }

        return ResponseEntity.ok(Map.of(
                "userInfo", userInfo,
                "recentPublications", recentPublications,
                "savedArticles", savedArticles
        ));
    }

    // =========================================================================
    // КЕРУВАННЯ ЗБЕРЕЖЕНИМИ СТАТТЯМИ
    // =========================================================================

    @GetMapping("/saved/{slug}/check")
    public ResponseEntity<?> checkSaved(@PathVariable String slug) {
        String activeUsername = getActiveUsernameSafely();
        boolean isSaved = savedArticleRepository.existsByUsernameAndArticleSlug(activeUsername, slug);
        return ResponseEntity.ok(Map.of("isSaved", isSaved));
    }

    @PostMapping("/saved")
    public ResponseEntity<?> saveArticle(@RequestBody Map<String, String> request) {
        String activeUsername = getActiveUsernameSafely();
        if (activeUsername == null || "anonymousUser".equals(activeUsername)) {
            return ResponseEntity.status(401).build();
        }

        String slug = request.get("slug");
        String title = request.get("title");

        if (!savedArticleRepository.existsByUsernameAndArticleSlug(activeUsername, slug)) {
            SavedArticle sa = new SavedArticle();
            sa.setUsername(activeUsername);
            sa.setArticleSlug(slug);
            sa.setArticleTitle(title);
            sa.setSavedAt(LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            savedArticleRepository.save(sa);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/saved/{slug}")
    public ResponseEntity<?> unsaveArticle(@PathVariable String slug) {
        String activeUsername = getActiveUsernameSafely();
        if (activeUsername != null && !"anonymousUser".equals(activeUsername)) {
            savedArticleRepository.deleteByUsernameAndArticleSlug(activeUsername, slug);
        }
        return ResponseEntity.ok().build();
    }
}