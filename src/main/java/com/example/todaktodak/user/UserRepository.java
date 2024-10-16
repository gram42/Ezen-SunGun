package com.example.todaktodak.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserid(String userid); // 중복 확인을 위한 메서드
    
}