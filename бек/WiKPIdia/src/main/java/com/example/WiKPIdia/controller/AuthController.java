package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    // Глобальна змінна-сесія, щоб сайт пам'ятав, хто зараз онлайн
    public static String currentSessionUser = "termenatorof";

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");

        // 1. Перевіряємо, чи немає вже такого юзера
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Цей логін вже зайнятий!"));
        }

        // 2. Створюємо нового користувача і записуємо в БД
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password); // Зберігаємо пароль
        newUser.setEmail(userData.getOrDefault("email", username + "@edu.kpi.ua"));
        newUser.setFullName(userData.getOrDefault("fullName", "Користувач " + username));
        newUser.setRole("Користувач"); // За замовчуванням всі новачки — звичайні користувачі

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        newUser.setCreatedAt(today);

        userRepository.save(newUser);

        currentSessionUser = username; // Одразу авторизуємо після реєстрації
        return ResponseEntity.ok(Map.of("message", "Реєстрація успішна!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // 1. Шукаємо користувача в базі
        Optional<User> userOptional = userRepository.findByUsername(username);

        // 2. Якщо юзер є і пароль співпадає — пускаємо
        if (userOptional.isPresent() && userOptional.get().getPassword().equals(password)) {
            User user = userOptional.get();
            currentSessionUser = user.getUsername(); // Запам'ятовуємо, хто зайшов

            return ResponseEntity.ok(Map.of(
                    "token", "real-session-token",
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        }

        // 3. Якщо пароль невірний — відкидаємо запит
        return ResponseEntity.status(401).body(Map.of("message", "Неправильний логін або пароль."));
    }
}