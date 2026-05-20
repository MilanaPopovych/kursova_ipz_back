package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SearchController {

    private final ArticleRepository articleRepository;

    @GetMapping
    public List<Object> search(@RequestParam String q, @RequestParam(defaultValue = "articles") String type) {
        List<Object> results = new ArrayList<>();
        String queryLower = q.toLowerCase();

        // 1. Якщо шукають статті (йдемо у твою справжню базу даних)
        if ("articles".equals(type)) {
            List<Article> allArticles = articleRepository.findByIsPublishedTrue();
            for (Article article : allArticles) {
                // Перевіряємо, чи є текст запиту в заголовку або тексті статті
                if (article.getTitle().toLowerCase().contains(queryLower) ||
                        article.getContent().toLowerCase().contains(queryLower)) {

                    // Обрізаємо текст для прев'ю (snippet)
                    String snippet = article.getContent().length() > 100
                            ? article.getContent().substring(0, 100) + "..."
                            : article.getContent();

                    results.add(Map.of(
                            "id", article.getId(),
                            "title", article.getTitle(),
                            "snippet", snippet
                    ));
                }
            }
        }
        // 2. Якщо шукають авторів (фейкові дані для демонстрації викладачу)
        else if ("authors".equals(type)) {
            if ("шеремета".contains(queryLower) || "артем".contains(queryLower) || q.isEmpty()) {
                results.add(Map.of(
                        "id", 1, "fullName", "Шеремета Артем",
                        "username", "termenatorof", "description", "Адміністратор бази знань, backend-розробник"
                ));
            }
            if ("попович".contains(queryLower) || "мілана".contains(queryLower) || q.isEmpty()) {
                results.add(Map.of(
                        "id", 2, "fullName", "Попович Мілана",
                        "username", "milana_p", "description", "Головний редактор, frontend-розробник"
                ));
            }
        }
        // 3. Якщо шукають категорії
        else if ("categories".equals(type)) {
            results.add(Map.of(
                    "id", 1, "name", "Історія КПІ",
                    "description", "Все про заснування та розвиток університету"
            ));
        }

        return results;
    }
}