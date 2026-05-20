package com.example.WiKPIdia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Вимикаємо захист CSRF для нашого API
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Тимчасово дозволяємо доступ ДО ВСЬОГО без логінів і паролів
                );
        return http.build();
    }
}