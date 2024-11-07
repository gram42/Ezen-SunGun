package com.example.todaktodak.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserid(String userid); // 중복 확인을 위한 메서드
    
    User findByUserName(String userName); // 닉네임으로 유저 정보 찾기

    List<User> findByEmail(String email);
    
}