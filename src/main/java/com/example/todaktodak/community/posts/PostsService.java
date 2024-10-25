package com.example.todaktodak.community.posts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

import com.example.todaktodak.user.User;

@Service
public class PostsService {

    @Autowired
    private PostsRepository postsRepository;

    // 모든 게시글을 페이지네이션과 함께 조회
    public Page<Posts> getAllPosts(Pageable pageable) {
        Pageable sortedByDate = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        return postsRepository.findAll(sortedByDate);
    }

    // 게시물 ID로 게시글 조회
    public Posts getPostById(Long postId) {
        return postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    // 유저 ID로 게시글 조회
    public List<Posts> getPostsByUserId(Long userId) {
        return postsRepository.findByUserId(userId);
    }

    public Page<Posts> getPostsByUserId(Long userId, Pageable pageable) {
        // 유저 ID로 게시물 조회 로직
        // 예를 들어, DB에서 게시물을 찾지 못하는 경우 null을 반환하는지 확인
        return postsRepository.findByUserId(userId, pageable);
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
