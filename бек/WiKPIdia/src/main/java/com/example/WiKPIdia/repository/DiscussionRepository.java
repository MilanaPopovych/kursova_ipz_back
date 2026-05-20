package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    // Spring Data JPA сам напише SQL-запит на основі цієї назви методу!
    List<Discussion> findByArticleSlugOrderByCreatedAtDesc(String articleSlug);
}