package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.SavedArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SavedArticleRepository extends JpaRepository<SavedArticle, Long> {
    List<SavedArticle> findByUsernameOrderByIdDesc(String username);
    boolean existsByUsernameAndArticleSlug(String username, String articleSlug);

    @Transactional
    void deleteByUsernameAndArticleSlug(String username, String articleSlug);
}