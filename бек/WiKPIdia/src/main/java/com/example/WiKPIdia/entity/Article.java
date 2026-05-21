package com.example.WiKPIdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import jakarta.persistence.PrePersist;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "articles")
@Data
@EqualsAndHashCode(exclude = "categories") // Захист від нескінченного циклу Lombok
public class Article {

    private String createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String comment;

    @Column(unique = true, nullable = false)
    private String slug;

    // слаг оригінальної статті (заповнюється тільки для правок)
    private String originalArticleSlug;

    private String author;

    private String version = "1.0";

    private Boolean isPublished = false;
    // чи редагувалась стаття після публікації
    private Boolean wasEdited = false;
    // Article тепер є ВЛАСНИКОМ зв'язку. Тому JoinTable знаходиться тут.
    @ManyToMany
    @JoinTable(
            name = "article_categories",
            joinColumns = @JoinColumn(name = "article_id", referencedColumnName = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonIgnoreProperties("articles") // захист від нескінченного JSON
    private Set<Category> categories = new HashSet<>();
}