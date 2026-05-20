package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository; // Додали репозиторій юзерів

    @GetMapping("/profile")
    public Map<String, Object> getUserProfile() {

        // 1. Дістаємо користувача з бази даних за поточним логіном
        String activeUsername = AuthController.currentSessionUser;
        User currentUser = userRepository.findByUsername(activeUsername)
                .orElseGet(() -> {
                    // Страхувальний варіант (якщо раптом БД порожня після перезапуску)
                    User fallback = new User();
                    fallback.setUsername(activeUsername);
                    fallback.setFullName("Невідомий Користувач");
                    fallback.setRole("Гість");
                    return fallback;
                });

        Map<String, Object> userInfo = Map.of(
                "username", currentUser.getUsername(),
                "fullName", currentUser.getFullName() != null ? currentUser.getFullName() : "",
                "email", currentUser.getEmail() != null ? currentUser.getEmail() : "",
                "role", currentUser.getRole() != null ? currentUser.getRole() : "Користувач",
                "createdAt", currentUser.getCreatedAt() != null ? currentUser.getCreatedAt() : "Сьогодні"
        );

        // 2. Справжні статті (залишаємо як було в минулому кроці)
        List<Article> realArticles = articleRepository.findAll();
        List<Map<String, String>> recentPublications = new ArrayList<>();
        List<Map<String, String>> savedArticles = new ArrayList<>();

        for (Article article : realArticles) {
            recentPublications.add(Map.of(
                    "id", String.valueOf(article.getId()),
                    "title", article.getTitle(),
                    "type", "Стаття",
                    "date", "19.05.2026"
            ));
        }
        if (!realArticles.isEmpty()) {
            Article firstArticle = realArticles.get(0);
            savedArticles.add(Map.of(
                    "id", String.valueOf(firstArticle.getId()), "title", firstArticle.getTitle(),
                    "slug", String.valueOf(firstArticle.getId()), "savedAt", "19.05.2026"
            ));
        }

        return Map.of(
                "userInfo", userInfo,
                "recentPublications", recentPublications,
                "savedArticles", savedArticles
        );
    }
}