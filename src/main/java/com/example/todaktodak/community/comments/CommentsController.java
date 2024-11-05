package com.example.todaktodak.community.comments;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.todaktodak.community.posts.PostsController;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
public class CommentsController {

    private static final Logger logger = LoggerFactory.getLogger(PostsController.class);

    @Autowired
    private CommentsService commentsService;

    // 모든 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentsDTO>> getAllComments() {
        List<Comments> comments = commentsService.getAllComments();
        List<CommentsDTO> commentDTOs = comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }

    // ID로 댓글 조회
    @GetMapping("/{id}")
    public ResponseEntity<CommentsDTO> getCommentById(@PathVariable(name = "id") Long id) {
        Comments comment = commentsService.getCommentById(id);
        CommentsDTO commentDTO = convertToDTO(comment);
        return ResponseEntity.ok(commentDTO);
    }

    // 댓글 생성
    @PostMapping("/{postId}")
    public ResponseEntity<CommentsDTO> createComment(@PathVariable(name = "postId") Long postId, @RequestBody CommentsDTO commentDTO) {
        try {
            // 댓글 생성
            CommentsDTO createdComment = commentsService.createComment(postId, commentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
        } catch (Exception e) {
            System.err.println("Error occurred while creating comment: " + e.getMessage()); // 에러 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<CommentsDTO> updateComment(@PathVariable(name = "id") Long id, @RequestBody CommentsDTO commentDTO) {
        try {
            CommentsDTO updatedComment = commentsService.updateComment(id, commentDTO);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            System.err.println("Error occurred while updating comment: " + e.getMessage()); // 에러 로그
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable(name = "id") Long id) {
        try {
            commentsService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Error occurred while deleting comment: " + e.getMessage()); // 에러 로그
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // 댓글 작성자가 자신의 댓글 조회
    @GetMapping("/user/{userId}")
public ResponseEntity<Map<String, Object>> getCommentsByUserId(@PathVariable(name = "userId") Long userId, Pageable pageable) {
    logger.info("유저 ID: {}, 요청된 페이지: {}, 페이지 크기: {}", userId, pageable.getPageNumber(), pageable.getPageSize());
    try {
        Page<Comments> comments = commentsService.getCommentsByUserId(userId, pageable);
        if (comments.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "댓글이 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse); // 404 Not Found
        }

        List<CommentsDTO> commentDTOs = comments.getContent().stream()
                .map(comment -> new CommentsDTO(
                        comment.getCommentsId(),
                        comment.getPost().getPostId(),
                        comment.getUser().getId(),
                        comment.getCommentText(),
                        comment.getCreatedAt()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", commentDTOs);
        response.put("totalElements", comments.getTotalElements());
        response.put("totalPages", comments.getTotalPages());
        response.put("currentPage", comments.getNumber());

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        logger.error("사용자 {}의 댓글을 가져오는 중 오류 발생: {}", userId, e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "댓글을 가져오는 중 오류 발생: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

    // DTO 변환 메서드
    private CommentsDTO convertToDTO(Comments comment) {
        return new CommentsDTO(
                comment.getCommentsId(),
                comment.getPost().getPostId(),
                comment.getUser().getId(),
                comment.getCommentText(),
                comment.getCreatedAt()
        );
    }
}
