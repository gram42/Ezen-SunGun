package com.example.todaktodak.community.comments;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.todaktodak.community.posts.Posts;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    // 게시글 ID로 댓글 조회
    List<Comments> findByPost_PostId(Long postId);
    Page<Comments> findByPost_PostId(Long postId, Pageable pageable);
    
    // 사용자 ID로 댓글 조회
    List<Comments> findByUser_Id(Long userId);
    Page<Comments> findByUser_Id(Long userId, Pageable pageable);

    // 댓글 ID로 게시글 조회
    @Query("SELECT c.post FROM Comments c WHERE c.id = :commentId")
    Posts findPostByCommentId(@Param("commentId") Long commentId);
}
