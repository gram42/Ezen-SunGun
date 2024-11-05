package com.example.todaktodak.community.posts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findByUserId(Long userId);  // 유저 ID로 게시글 찾기 (비페이지네이션)
    Page<Posts> findByUserId(Long userId, Pageable pageable); // 유저 ID로 게시글 찾기 (페이지네이션 지원)
}
