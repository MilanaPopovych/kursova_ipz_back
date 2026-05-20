package com.example.WiKPIdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Data
@EqualsAndHashCode(exclude = "articles") // Захист від нескінченного циклу Lombok
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "parent_id")
    private Long parentId;

    // Вказуємо, що зв'язком керує Article
    @ManyToMany(mappedBy = "categories")
    @JsonIgnoreProperties("categories") // Захист від нескінченного JSON
    private Set<Article> articles = new HashSet<>();
}