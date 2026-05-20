package com.example.WiKPIdia.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users") // Називаємо таблицю users
@Data // Lombok автоматично створить геттери та сеттери
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // Для курсової зберігатимемо як є, без складного шифрування

    private String fullName;
    private String email;
    private String role;
    private String createdAt;
}