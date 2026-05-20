package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.Category;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.CategoryRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    // Record для прийому даних з фронтенду
    public record CategoryCreateRequest(String name, String description, List<Long> articleIds) {}

    // Отримання всіх категорій (з підтримкою пошуку та сортування)
    @GetMapping
    public List<Category> getAllCategories(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "") String sort) {

        List<Category> categories = categoryRepository.findAll();

        // Фільтрація за текстом
        if (query != null && !query.trim().isEmpty()) {
            categories = categories.stream()
                    .filter(c -> c.getName().toLowerCase().contains(query.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Сортування за алфавітом
        if ("asc".equalsIgnoreCase(sort)) {
            categories = categories.stream()
                    .sorted((c1, c2) -> c1.getName().compareToIgnoreCase(c2.getName()))
                    .collect(Collectors.toList());
        } else if ("desc".equalsIgnoreCase(sort)) {
            categories = categories.stream()
                    .sorted((c1, c2) -> c2.getName().compareToIgnoreCase(c1.getName()))
                    .collect(Collectors.toList());
        }

        return categories;
    }

    // Створення нової категорії (Тільки для Адміна)
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryCreateRequest request) {

        String activeUsername = AuthController.currentSessionUser;
        User currentUser = null;
        if (activeUsername != null) {
            currentUser = userRepository.findByUsername(activeUsername).orElse(null);
        }

        if (currentUser == null || !("Адміністратор".equals(currentUser.getRole()) || "Адмін".equals(currentUser.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Тільки адміністратор може створювати категорії."));
        }

        if (request.name() == null || request.name().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Назва категорії не може бути порожньою."));
        }

        Category category = new Category();
        category.setName(request.name().trim());

        if (request.description() != null) {
            category.setDescription(request.description().trim());
        }

        // 1. Зберігаємо категорію, щоб отримати ID
        Category savedCategory = categoryRepository.save(category);

        // 2. Якщо були обрані статті, дістаємо їх і додаємо їм цю категорію
        if (request.articleIds() != null && !request.articleIds().isEmpty()) {
            List<Article> selectedArticles = articleRepository.findAllById(request.articleIds());

            for (Article article : selectedArticles) {
                article.getCategories().add(savedCategory);
            }
            // 3. Зберігаємо статті (запишеться в проміжну таблицю)
            articleRepository.saveAll(selectedArticles);
        }

        return ResponseEntity.ok(savedCategory);
    }

    // Видалення категорії за ID (Тільки для Адміна)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {

        String activeUsername = AuthController.currentSessionUser;
        User currentUser = null;
        if (activeUsername != null) {
            currentUser = userRepository.findByUsername(activeUsername).orElse(null);
        }

        if (currentUser == null || !("Адміністратор".equals(currentUser.getRole()) || "Адмін".equals(currentUser.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Тільки адміністратор може видаляти категорії."));
        }

        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Категорію не знайдено."));
        }

        // Очищаємо зв'язки перед видаленням, щоб PostgreSQL не видав помилку
        if (category.getArticles() != null) {
            for (Article article : category.getArticles()) {
                article.getCategories().remove(category);
            }
            articleRepository.saveAll(category.getArticles());
        }

        categoryRepository.delete(category);

        return ResponseEntity.ok(Map.of("message", "Категорію успішно видалено."));
    }
}