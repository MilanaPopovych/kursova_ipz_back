package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Пошук статті за її текстовим посиланням
    Optional<Article> findBySlug(String slug);

    // Отримати всі опубліковані статті (для головної сторінки)
    List<Article> findByIsPublishedTrue();

    // Отримати всі нерозглянуті статті (для сторінки модерації адміна)
    List<Article> findByIsPublishedFalse();
}