package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, Long> {

    // Метод для пошуку всіх правок, які ще очікують на перевірку
    List<Revision> findByStatus(String status);
}