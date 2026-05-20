package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Магічний метод Spring, який сам знайде користувача за логіном
    Optional<User> findByUsername(String username);

    // Перевірка, чи не зайнятий такий логін
    boolean existsByUsername(String username);
}