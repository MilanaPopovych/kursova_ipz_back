package com.example.WiKPIdia.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "revisions")
@Data
public class Revision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Зв'язок: Багато правок можуть належати одній статті
    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // Статус правки: PENDING (очікує), APPROVED (затверджено), REJECTED (відхилено)
    @Column(nullable = false)
    private String status = "PENDING";
}