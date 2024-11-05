package com.example.todaktodak.community.posts;

import com.example.todaktodak.community.comments.Comments;
import java.util.List;

public class PostResponse {
    private Posts post; // 게시글 정보
    private List<Comments> comments; // 해당 게시글에 대한 댓글 목록

    public PostResponse(Posts post, List<Comments> comments) {
        this.post = post;
        this.comments = comments;
    }

    // Getters and Setters
    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public List<Comments> getComments() {
        return comments;
    }

    public void setComments(List<Comments> comments) {
        this.comments = comments;
    }
}
