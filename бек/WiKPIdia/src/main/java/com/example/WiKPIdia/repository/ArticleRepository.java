package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findBySlug(String slug);

    List<Article> findByIsPublishedTrue();

    List<Article> findByIsPublishedFalse();
    // пошук статей за автором
    List<Article> findByAuthor(String author);
    // пошук всіх правок для конкретної статті
    List<Article> findByOriginalArticleSlugAndIsPublishedFalse(String originalArticleSlug);
}