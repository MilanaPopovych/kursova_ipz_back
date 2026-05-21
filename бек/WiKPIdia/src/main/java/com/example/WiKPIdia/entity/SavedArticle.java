package com.example.WiKPIdia.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "saved_articles")
@Data
public class SavedArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;       // Хто зберіг
    private String articleSlug;    // Унікальне посилання на статтю
    private String articleTitle;   // Назва (щоб швидко виводити в кабінеті)
    private String savedAt;        // Дата збереження
}