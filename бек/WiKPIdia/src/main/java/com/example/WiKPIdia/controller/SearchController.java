package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.Category;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Object> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "articles") String type) {

        List<Object> results = new ArrayList<>();
        String queryLower = q.toLowerCase();

        // 1. Пошук статей
        if ("articles".equals(type)) {
            List<Article> allArticles = articleRepository.findByIsPublishedTrue();
            for (Article article : allArticles) {
                if (article.getTitle().toLowerCase().contains(queryLower) ||
                        article.getContent().toLowerCase().contains(queryLower)) {

                    String snippet = article.getContent().length() > 150
                            ? article.getContent().substring(0, 150) + "..."
                            : article.getContent();

                    results.add(Map.of(
                            "id", article.getId(),
                            "title", article.getTitle(),
                            "slug", article.getSlug() != null ? article.getSlug() : String.valueOf(article.getId()),
                            "snippet", snippet
                    ));
                }
            }
        }

        // 2. Пошук категорій
        else if ("categories".equals(type)) {
            List<Category> allCategories = categoryRepository.findAll();
            for (Category category : allCategories) {
                if (category.getName().toLowerCase().contains(queryLower)) {
                    results.add(Map.of(
                            "id", category.getId(),
                            "name", category.getName()
                    ));
                }
            }
        }

        return results;
    }
}