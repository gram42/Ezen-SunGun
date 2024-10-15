package com.example.todaktodak.category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;


public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    @NonNull
    Optional<Categories> findById(@NonNull Long id);
}
