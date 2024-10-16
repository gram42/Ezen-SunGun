package com.example.todaktodak.community.posts;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class PostsDTO {
    private Long postId;
    private Long userId;  
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private int commentCount;  // 댓글 수 추가
    private String userName; // 작성자의 사용자 이름 추가

    public PostsDTO() {}

    // UserID와 title, content, createdAt을 받는 생성자
    public PostsDTO(Long userId, String title, String content, LocalDateTime createdAt, int commentCount, String userName) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.commentCount = commentCount;  // 댓글 수 설정
        this.userName = userName;
    }

    // postId와 userId, title, content, createdAt을 받는 생성자
    public PostsDTO(Long postId, Long userId, String title, String content, LocalDateTime createdAt, int commentCount, String userName) {
        this.postId = postId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.commentCount = commentCount;  // 댓글 수 설정
        this.userName =userName;
        
    }

    public PostsDTO(Long postId, Long userId, String title, String content, LocalDateTime createdAt, int commentCount) {
        this.postId = postId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.commentCount = commentCount;  // 댓글 수 설정
    }
    
}
