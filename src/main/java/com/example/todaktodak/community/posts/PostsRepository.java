package com.example.todaktodak.community.posts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findByUserId(Long userId);  // 유저 ID로 게시글 찾기 (비페이지네이션)
    Page<Posts> findByUserId(Long userId, Pageable pageable); // 유저 ID로 게시글 찾기 (페이지네이션 지원)


// 제목 검색
@Query("SELECT p FROM Posts p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
Page<Posts> findByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);

// 작성자 검색
@Query("SELECT p FROM Posts p WHERE LOWER(p.user.userName) LIKE LOWER(CONCAT('%', :author, '%'))")
Page<Posts> findByAuthorContainingIgnoreCase(@Param("author") String author, Pageable pageable);

// 댓글 내용 검색
@Query("SELECT p FROM Posts p JOIN p.comments c WHERE LOWER(c.commentText) LIKE LOWER(CONCAT('%', :comment, '%'))")
Page<Posts> findByCommentsContentContainingIgnoreCase(@Param("comment") String comment, Pageable pageable);
}
