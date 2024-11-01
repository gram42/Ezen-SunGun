package com.example.todaktodak.community.posts;

import com.example.todaktodak.community.comments.Comments;
import com.example.todaktodak.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList; 
import java.util.List;

@Entity
@Getter
@Setter
@ToString
public class Posts {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId; // 게시글 ID

    @ManyToOne(fetch = FetchType.EAGER) // 여러 게시물은 하나의 유저와 연결
    @JoinColumn(name = "user_id") // 외래 키 명을 설정
    private User user; // 유저와의 관계

    @Column(nullable = false, length = 100) // 제목 글자 수 제한
    private String title; // 게시글 제목

    @Column(nullable = false, length = 1000) // 내용 글자 수 제한
    private String content; // 게시글 내용

    private LocalDateTime createdAt; // 작성 시간

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Comments> comments = new ArrayList<>(); // 기본값을 빈 리스트로 설정

    @Column(name = "user_name") // userName 컬럼 이름 설정
    private String userName; // 작성자의 사용자 이름 추가

    @Column(name = "author")
    private String author;
    
    public String getUserName() {
        return user != null ? user.getUserName() : null;
    }


    public Posts() {}

    public Posts(User user, String title, String content) {
        this.user = user;
        this.title = title;
        this.content = content;
    }

    // 엔티티가 처음 저장될 때 작성 시간을 자동으로 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Posts(Long postId, User user, String title, String content, LocalDateTime createdAt, String userName) {
        this.postId = postId;
        this.user = user;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.userName = userName;
    }
}
