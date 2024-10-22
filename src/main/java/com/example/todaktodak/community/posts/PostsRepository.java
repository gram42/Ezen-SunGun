package com.example.todaktodak.community.posts;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {
  
    List<Posts> findByUserId(Long userId);  // 유저 ID로 게시글 찾기 (필요시 추가)
}
