package com.example.todaktodak.community.comments;

import com.example.todaktodak.community.posts.Posts;
import com.example.todaktodak.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentsId; // 댓글 ID

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = true) // 외래 키는 필수 값이므로 nullable = false, 계정 탈퇴시 게시글에 댓글만 남도록 null 가능으로 수정
    @JsonBackReference
    private Posts post; // 댓글이 달린 게시글

    @ManyToOne // 여러 댓글은 하나의 유저와 연결
    @JoinColumn(name = "user_id", nullable = true) // 외래 키는 필수 값이므로 nullable = false, 계정 탈퇴시 게시글에 댓글만 남도록 null 가능으로 수정
    private User user; // 유저와의 관계

    @Column(nullable = false, length = 500)
    private String commentText; // 댓글 내용

    @Column(nullable = false)
    private LocalDateTime createdAt; // 작성 시간

    @Column(name = "user_name") // userName 컬럼 이름 설정
    private String userName; // 작성자의 사용자 이름 추가

    public Comments() {}

    public Comments(Posts post, User user, String commentText, String userName) {
        this.post = post;
        this.user = user;
        this.commentText = commentText;
        this.createdAt = LocalDateTime.now(); // 생성자에서 자동으로 시간 설정
        this.userName = userName;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    }

    public Comments(Long commentsId, Posts post, User user, String commentText, String userName) {
        this.commentsId = commentsId;
        this.post = post;
        this.user = user;
        this.commentText = commentText;
        this.createdAt = LocalDateTime.now(); // 생성자에서 자동으로 시간 설정
        this.userName = userName;
    }
}
