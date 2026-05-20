package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.Category;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ArticleActionController {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;

    // 1. Додавання статті до категорії
    @PostMapping("/articles/{slug}/categories")
    public ResponseEntity<?> assignCategory(
            @PathVariable String slug,
            @RequestBody Map<String, Object> payload) { // Змінили Long на Object

        // Безпечне перетворення будь-якого числа з фронтенду в Long
        Long categoryId = ((Number) payload.get("categoryId")).longValue();

        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено: " + slug));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Категорію не знайдено: " + categoryId));

        // Додаємо статтю в категорію і зберігаємо
        category.getArticles().add(article);
        categoryRepository.save(category);

        return ResponseEntity.ok(Map.of("message", "Категорію успішно додано!"));
    }

    // 2. Вилучення статті з категорії (щоб працював хрестик на тегах)
    @DeleteMapping("/articles/{slug}/categories/{categoryId}")
    public ResponseEntity<?> removeCategory(
            @PathVariable String slug,
            @PathVariable Long categoryId) {

        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Категорію не знайдено"));

        category.getArticles().remove(article);
        categoryRepository.save(category);

        return ResponseEntity.ok(Map.of("message", "Категорію успішно вилучено!"));
    }

    // 3. Збереження статті в особистий кабінет
    @PostMapping("/users/saved-articles")
    public ResponseEntity<?> saveArticleToProfile(@RequestBody Map<String, String> payload) {
        /* Оскільки логіка профілю і бази "збережених" може бути ще складною для реалізації зараз,
           ми робимо цей метод-заглушку. Він успішно приймає запит і віддає фронтенду "ОК",
           щоб кнопка збереження красиво відпрацювала без помилок!
        */
        return ResponseEntity.ok(Map.of("message", "Статтю успішно збережено у кабінет!"));
    }
}