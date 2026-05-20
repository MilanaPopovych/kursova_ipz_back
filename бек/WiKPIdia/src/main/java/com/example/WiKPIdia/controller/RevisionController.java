package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Revision;
import com.example.WiKPIdia.service.RevisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revisions")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RevisionController {

    private final RevisionService revisionService;

    public record RevisionRequest(Long articleId, Long authorId, String content) {}

    @PostMapping
    public Revision propose(@RequestBody RevisionRequest request) {
        return revisionService.proposeRevision(
                request.articleId(),
                request.authorId(),
                request.content()
        );
    }

    // Той самий метод, який давав 404
    @PostMapping("/{id}/approve")
    public void approve(@PathVariable Long id) {
        revisionService.approveRevision(id);
    }

    // Спеціальний тестовий метод для перевірки!
    @GetMapping("/test")
    public String test() {
        return "Контролер правок працює ідеально!";
    }
}