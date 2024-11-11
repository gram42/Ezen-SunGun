package com.example.todaktodak.achievement_rate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todaktodak.user.User;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    
    // 유저 아이디로 유저 달성률 목표 찾기
    List<Achievement> findByUser(User user);
}
