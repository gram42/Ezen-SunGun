package com.example.todaktodak.community.comments;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    // 게시글 ID로 댓글 조회
    List<Comments> findByPost_PostId(Long postId);
    
    // 사용자 ID로 댓글 조회
    Page<Comments> findByUser_Id(Long userId, Pageable pageable);
}
