package com.example.WiKPIdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "articles")
@Data
@EqualsAndHashCode(exclude = "categories") // Захист від нескінченного циклу Lombok
public class Article {

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

    private String author;

    private String version = "1.0";

    private Boolean isPublished = false;

    // Article тепер є ВЛАСНИКОМ зв'язку. Тому JoinTable знаходиться тут.
    @ManyToMany
    @JoinTable(
            name = "article_categories",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonIgnoreProperties("articles") // Захист від нескінченного JSON
    private Set<Category> categories = new HashSet<>();
}