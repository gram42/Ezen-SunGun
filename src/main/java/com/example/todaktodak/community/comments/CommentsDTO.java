package com.example.todaktodak.community.comments;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class CommentsDTO {
    private Long commentsId; // 댓글 ID
    private Long postId; // 게시글 ID
    private Long userId; // 유저 ID
    private String commentText; // 댓글 내용
    private LocalDateTime createdAt; // 작성 시간
    private String userName; // 작성자의 사용자 이름 추가

    // 기본 생성자
    public CommentsDTO() {}

    // 모든 필드를 받는 생성자
    public CommentsDTO(Long commentsId, Long postId, Long userId, String commentText, LocalDateTime createdAt, String userName) {
        this.commentsId = commentsId;
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.userName = userName;
    }

    // userName을 제외한 모든 필드를 받는 생성자
    public CommentsDTO(Long commentsId, Long postId, Long userId, String commentText, LocalDateTime createdAt) {
        this.commentsId = commentsId;
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
    }

    // userName을 제외한 생성자 추가
    public CommentsDTO(Long postId, Long userId, String commentText, LocalDateTime createdAt) {
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
    }
}
