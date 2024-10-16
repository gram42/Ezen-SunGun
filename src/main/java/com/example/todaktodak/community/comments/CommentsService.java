package com.example.todaktodak.community.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todaktodak.user.User;
import com.example.todaktodak.user.UserService;
import com.example.todaktodak.community.posts.Posts;
import com.example.todaktodak.community.posts.PostsService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentsService {

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostsService postsService;

    // 모든 댓글 조회
    public List<Comments> getAllComments() {
        return commentsRepository.findAll();
    }

    // 댓글 ID로 조회
    public Comments getCommentById(Long id) {
        return commentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    // 댓글 생성
    @Transactional // 트랜잭션 관리
    public CommentsDTO createComment(Long postId, CommentsDTO commentDTO) {
        // 현재 사용자 가져오기
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Current user not found");
        }

        // 게시글 가져오기
        Posts post = postsService.getPostById(postId);
        if (post == null) {
            throw new RuntimeException("Post not found");
        }

        // 댓글 텍스트 유효성 검사
        if (commentDTO.getCommentText() == null || commentDTO.getCommentText().trim().isEmpty()) {
            throw new RuntimeException("Comment text cannot be empty");
        }

        // 댓글 객체 생성 및 값 설정
        Comments comment = new Comments();
        comment.setPost(post);
        comment.setUser(currentUser);
        comment.setCommentText(commentDTO.getCommentText());
        comment.setCreatedAt(LocalDateTime.now());

        // 댓글 저장 및 DTO 변환하여 반환
        Comments savedComment = saveComment(comment);
        return convertToDTO(savedComment);
    }

    // 댓글 저장 메서드
    private Comments saveComment(Comments comment) {
        return commentsRepository.save(comment);
    }

    // 댓글 수정
    @Transactional // 트랜잭션 관리
    public CommentsDTO updateComment(Long id, CommentsDTO commentDTO) {
        Comments comment = getCommentById(id); // 댓글 ID로 조회

        // 댓글 텍스트 유효성 검사
        if (commentDTO.getCommentText() == null || commentDTO.getCommentText().trim().isEmpty()) {
            throw new RuntimeException("Comment text cannot be empty");
        }

        // 댓글 정보 업데이트
        comment.setCommentText(commentDTO.getCommentText());
        Comments updatedComment = saveComment(comment); // 댓글 저장
        return convertToDTO(updatedComment); // DTO 변환하여 반환
    }

    // 댓글 삭제
    public void deleteComment(Long id) {
        if (!commentsRepository.existsById(id)) {
            throw new RuntimeException("Comment not found");
        }
        commentsRepository.deleteById(id);
    }

   // 게시글 ID로 댓글 조회
    public List<CommentsDTO> getCommentsByPostId(Long postId) {
        List<Comments> comments = commentsRepository.findByPost_PostId(postId);
        return comments.stream()
            .map(this::convertToDTO) // convertToDTO 메소드 사용
            .collect(Collectors.toList()); // Collectors.toList() 사용
    }


    // 댓글 DTO 변환
    private CommentsDTO convertToDTO(Comments comment) {
        String userName = (comment.getUser() != null) ? comment.getUser().getUserName() : "작성자 없음"; // Null 체크
        return new CommentsDTO(
                comment.getCommentsId(),
                comment.getPost().getPostId(),
                comment.getUser() != null ? comment.getUser().getId() : null, // Null 체크
                comment.getCommentText(),
                comment.getCreatedAt(),
                userName // 작성자 이름 추가
        );
    }


    // 유저 ID로 댓글 조회
    public List<Comments> getCommentsByUserId(Long userId) {
        return commentsRepository.findByUser_Id(userId);
    }
}
