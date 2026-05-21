package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Discussion;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.DiscussionRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionRepository discussionRepository;
    private final UserRepository userRepository;

    // =========================================================================
    // ДОПОМІЖНИЙ МЕТОД: Безпечне отримання поточного користувача
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
    // 1. ОТРИМАННЯ КОМЕНТАРІВ ДЛЯ СТАТТІ (З ПАГІНАЦІЄЮ)
    // =========================================================================
    @GetMapping("/articles/{slug}/discussions")
    public ResponseEntity<Page<Discussion>> getDiscussionsByArticle(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Discussion> discussionsPage = discussionRepository.findByArticleSlugOrderByCreatedAtDesc(slug, pageable);
        return ResponseEntity.ok(discussionsPage);
    }

    // =========================================================================
    // 2. СТВОРЕННЯ КОМЕНТАРЯ
    // =========================================================================
    @PostMapping("/articles/{slug}/discussions")
    public ResponseEntity<?> addDiscussion(
            @PathVariable String slug,
            @RequestBody Discussion discussion) {

        String activeUsername = getActiveUsernameSafely();

        if (activeUsername == null || activeUsername.isEmpty() || "anonymousUser".equals(activeUsername)) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Залишати коментарі можуть лише авторизовані користувачі!"
            ));
        }

        discussion.setArticleSlug(slug);
        discussion.setAuthor(activeUsername);

        Discussion savedDiscussion = discussionRepository.save(discussion);
        return ResponseEntity.ok(savedDiscussion);
    }

    // =========================================================================
    // 3. БЕЗПЕЧНЕ ВИДАЛЕННЯ (Тільки автор або Адмін)
    // =========================================================================
    @DeleteMapping("/articles/{slug}/discussions/{discussionId}")
    public ResponseEntity<?> deleteDiscussion(
            @PathVariable String slug,
            @PathVariable Long discussionId) {

        String activeUsername = getActiveUsernameSafely();

        if (activeUsername == null || activeUsername.isEmpty() || "anonymousUser".equals(activeUsername)) {
            return ResponseEntity.status(401).body(Map.of("message", "Потрібна авторизація для виконання цієї дії."));
        }

        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new RuntimeException("Коментар не знайдено"));

        User currentUser = userRepository.findByUsername(activeUsername)
                .orElseThrow(() -> new RuntimeException("Поточного користувача не знайдено в базі даних"));

        boolean isAdmin = currentUser.getRole() != null &&
                (currentUser.getRole().equalsIgnoreCase("Адміністратор") ||
                        currentUser.getRole().equalsIgnoreCase("Адмін") ||
                        currentUser.getRole().equalsIgnoreCase("ADMIN") ||
                        currentUser.getRole().equalsIgnoreCase("Головний редактор"));

        if (!isAdmin && !discussion.getAuthor().equals(activeUsername)) {
            return ResponseEntity.status(403).body(Map.of("message", "Ви можете видаляти лише власні коментарі!"));
        }

        discussionRepository.deleteById(discussionId);
        return ResponseEntity.ok().build();
    }

    // =========================================================================
    // 4. ОСОБИСТІ ОБГОВОРЕННЯ ДЛЯ КАБІНЕТУ (З ПАГІНАЦІЄЮ)
    // =========================================================================
    @GetMapping("/discussions/my")
    public ResponseEntity<?> getMyDiscussions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        String activeUsername = getActiveUsernameSafely();

        if (activeUsername == null || activeUsername.isEmpty() || "anonymousUser".equals(activeUsername)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Discussion> myDiscussionsPage = discussionRepository.findByAuthorOrderByIdDesc(activeUsername, pageable);

        return ResponseEntity.ok(myDiscussionsPage);
    }
}