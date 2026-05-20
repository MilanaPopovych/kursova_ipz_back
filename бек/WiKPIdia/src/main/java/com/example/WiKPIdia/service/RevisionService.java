package com.example.WiKPIdia.service;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.Revision;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.RevisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final RevisionRepository revisionRepository;
    private final ArticleRepository articleRepository;

    // Створення пропозиції правки (від Автора)
    @Transactional
    public Revision proposeRevision(Long articleId, Long authorId, String newContent) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено"));

        Revision revision = new Revision();
        revision.setArticle(article);
        revision.setAuthorId(authorId);
        revision.setContent(newContent);
        revision.setStatus("PENDING");

        return revisionRepository.save(revision);
    }

    // Затвердження правки (від Адміністратора)
    @Transactional
    public void approveRevision(Long revisionId) {
        // 1. Знаходимо правку
        Revision revision = revisionRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Правку не знайдено"));

        // 2. Затверджуємо її
        revision.setStatus("APPROVED");
        revisionRepository.save(revision);

        // 3. Оновлюємо головну статтю
        Article article = revision.getArticle();
        article.setContent(revision.getContent());
        articleRepository.save(article);
    }
}