package com.example.todaktodak.community.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
public class CommentsController {

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
    public ResponseEntity<CommentsDTO> getCommentById(@PathVariable Long id) {
        Comments comment = commentsService.getCommentById(id);
        CommentsDTO commentDTO = convertToDTO(comment);
        return ResponseEntity.ok(commentDTO);
    }

    // 댓글 생성
    @PostMapping("/{postId}")
    public ResponseEntity<CommentsDTO> createComment(@PathVariable Long postId, @RequestBody CommentsDTO commentDTO) {
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
    public ResponseEntity<CommentsDTO> updateComment(@PathVariable Long id, @RequestBody CommentsDTO commentDTO) {
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
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
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
    public ResponseEntity<List<CommentsDTO>> getCommentsByUserId(@PathVariable Long userId) {
        List<Comments> comments = commentsService.getCommentsByUserId(userId);
        List<CommentsDTO> commentDTOs = comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
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