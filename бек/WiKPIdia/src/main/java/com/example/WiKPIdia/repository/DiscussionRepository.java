package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Discussion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {

    // Отримання коментарів для статті з пагінацією
    Page<Discussion> findByArticleSlugOrderByCreatedAtDesc(String articleSlug, Pageable pageable);

    // Отримання коментарів конкретного користувача з пагінацією
    Page<Discussion> findByAuthorOrderByIdDesc(String author, Pageable pageable);
}