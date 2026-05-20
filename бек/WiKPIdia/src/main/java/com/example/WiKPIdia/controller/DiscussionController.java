package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Discussion;
import com.example.WiKPIdia.repository.DiscussionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionRepository discussionRepository;

    // Отримання всіх коментарів для статті
    @GetMapping("/{slug}/discussions")
    public List<Discussion> getDiscussionsByArticle(@PathVariable String slug) {
        return discussionRepository.findByArticleSlugOrderByCreatedAtDesc(slug);
    }

    // Створення нового коментаря
    @PostMapping("/{slug}/discussions")
    public ResponseEntity<Discussion> addDiscussion(
            @PathVariable String slug,
            @RequestBody Discussion discussion) {

        // 1. Прив'язуємо коментар до конкретної статті
        discussion.setArticleSlug(slug);

        // 2. Більше ніяких AuthController!
        // Фронтенд сам передає ім'я, ми лише ставимо заглушку на випадок, якщо воно порожнє
        if (discussion.getAuthor() == null || discussion.getAuthor().trim().isEmpty()) {
            discussion.setAuthor("Анонім");
        }

        // 3. Зберігаємо в базу даних
        Discussion savedDiscussion = discussionRepository.save(discussion);

        return ResponseEntity.ok(savedDiscussion);
    }

    // Метод для видалення коментаря (для адмінів)
    @DeleteMapping("/{slug}/discussions/{discussionId}")
    public ResponseEntity<?> deleteDiscussion(
            @PathVariable String slug,
            @PathVariable Long discussionId) {

        discussionRepository.deleteById(discussionId);
        return ResponseEntity.ok().build();
    }
}