package com.example.todaktodak.community.posts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.example.todaktodak.user.User;

@Service
public class PostsService {

    @Autowired
    private PostsRepository postsRepository;

    // 모든 게시글을 페이지네이션과 함께 조회
    public Page<Posts> getAllPosts(Pageable pageable) {
        return postsRepository.findAll(pageable);
    }

    // ID로 게시글 조회
    public Posts getPostById(Long postId) {
        return postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    // 유저 ID로 게시글 조회
    public List<Posts> getPostsByUserId(Long userId) {
        return postsRepository.findByUserId(userId);
    }

    // 게시글 생성
    public Posts createPost(PostsDTO postDTO, User user) {
        Posts post = new Posts();
        post.setUser(user);
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setCreatedAt(LocalDateTime.now());
        return postsRepository.save(post);
    }

    // 게시글 수정
    public Posts updatePost(Long postId, PostsDTO postDTO) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        return postsRepository.save(post);
    }

    // 게시글 삭제
    public void deletePost(Long postId) {
        postsRepository.deleteById(postId);
    }

    // 게시글에 댓글 수 가져오기
    public int getCommentCountByPost(Posts post) {
        return post.getComments().size();  // 댓글 리스트 크기로 댓글 수 반환
    }
}
