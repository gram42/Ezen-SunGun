package com.example.todaktodak.community.posts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.todaktodak.community.comments.CommentsDTO;
import com.example.todaktodak.community.comments.CommentsService;
import com.example.todaktodak.user.User;
import com.example.todaktodak.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
public class PostsController {

    private static final Logger logger = LoggerFactory.getLogger(PostsController.class);
    private final PostsService postsService;
    private final UserService userService;
    private final CommentsService commentsService;

    public PostsController(PostsService postsService, UserService userService, CommentsService commentsService) {
        this.postsService = postsService;
        this.userService = userService;
        this.commentsService = commentsService;
    }

    // 유저 ID로 게시글을 가져오는 API (페이지네이션 포함)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPosts(@PathVariable Long userId, Pageable pageable) {
        logger.info("유저 ID: {}, 요청된 페이지: {}, 페이지 크기: {}", userId, pageable.getPageNumber(), pageable.getPageSize());
        try {
            Page<Posts> posts = postsService.getPostsByUserId(userId, pageable);
            if (posts.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "게시글이 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse); // 404 Not Found
            }

            List<PostsDTO> postsDTOs = posts.getContent().stream()
                    .map(post -> new PostsDTO(
                            post.getPostId(),
                            post.getUser().getId(),
                            post.getTitle(),
                            post.getContent(),
                            post.getCreatedAt(),
                            postsService.getCommentCountByPost(post),
                            post.getUser().getUserName()))  // userName 추가
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("content", postsDTOs);
            response.put("totalElements", posts.getTotalElements());
            response.put("totalPages", posts.getTotalPages());
            response.put("currentPage", posts.getNumber());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("사용자 {}의 게시글을 가져오는 중 오류 발생: {}", userId, e.getMessage(), e); // 스택 트레이스 추가
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글을 가져오는 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 게시글 생성
    @PostMapping
    public ResponseEntity<PostsDTO> createPost(@RequestBody PostsDTO postDTO, Principal principal) {
        try {
            User user = userService.getUserByUserid(principal.getName());
            Posts createdPost = postsService.createPost(postDTO, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(new PostsDTO(
                    createdPost.getPostId(),
                    createdPost.getUser().getId(),
                    createdPost.getTitle(),
                    createdPost.getContent(),
                    createdPost.getCreatedAt(),
                    createdPost.getComments().size(),
                    createdPost.getUser().getUserName())); // userName 추가
        } catch (Exception e) {
            logger.error("게시글 생성 중 오류 발생: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글 생성 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 모든 게시글 조회 (페이지네이션 적용)
    @GetMapping
public ResponseEntity<Map<String, Object>> getAllPosts(Pageable pageable, Principal principal) {
    logger.info("모든 게시글 요청, 페이지: {}, 페이지 크기: {}", pageable.getPageNumber(), pageable.getPageSize());
    try {
        Page<Posts> postsPage = postsService.getAllPosts(pageable);

        // 추가적인 디버깅 정보
        logger.info("페이지 번호: {}", pageable.getPageNumber());
        logger.info("페이지 크기: {}", pageable.getPageSize());
        logger.info("총 게시물 수: {}", postsPage.getTotalElements());
        logger.info("총 페이지 수: {}", postsPage.getTotalPages());

        List<PostsDTO> postsDTOs = postsPage.getContent().stream()
                .map(post -> new PostsDTO(
                        post.getPostId(),
                        post.getUser().getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getCreatedAt(),
                        postsService.getCommentCountByPost(post),
                        post.getUser().getUserName()))  // userName 추가
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", postsDTOs);
        response.put("totalElements", postsPage.getTotalElements());
        response.put("totalPages", postsPage.getTotalPages());
        response.put("currentPage", postsPage.getNumber());
        
        logger.info("게시물 수: {}", postsPage.getTotalElements());
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        logger.error("게시글을 가져오는 중 오류 발생: {}", e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "게시글을 가져오는 중 오류 발생: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}


    // 게시글 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostsDTO> getPostById(@PathVariable Long postId) {
        Posts post = postsService.getPostById(postId);
        if (post == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글이 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 게시글이 존재하지 않을 경우
        }

        PostsDTO postDTO = new PostsDTO(
                post.getPostId(),
                post.getUser().getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                postsService.getCommentCountByPost(post),
                post.getUser().getUserName()
        );
        return ResponseEntity.ok(postDTO);
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostsDTO> updatePost(@PathVariable Long postId, @RequestBody PostsDTO postDTO) {
        Posts updatedPost = postsService.updatePost(postId, postDTO);
        if (updatedPost == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글이 존재하지 않습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(new PostsDTO(
                updatedPost.getPostId(),
                updatedPost.getUser().getId(),
                updatedPost.getTitle(),
                updatedPost.getContent(),
                updatedPost.getCreatedAt(),
                postsService.getCommentCountByPost(updatedPost),
                updatedPost.getUser().getUserName()));
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postsService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // 게시글에 대한 댓글 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentsDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentsDTO> commentDTOs = commentsService.getCommentsByPostId(postId);
        return ResponseEntity.ok(commentDTOs);
    }

    // 댓글 추가
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentsDTO> addComment(@PathVariable Long postId, @RequestBody CommentsDTO commentDTO, Principal principal) {
        if (principal == null) {
            // 로그인하지 않은 사용자
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        try {
            // 로그인한 사용자 정보를 가져옴
            User user = userService.getUserByUserid(principal.getName());
            commentDTO.setUserId(user.getId()); // 댓글 작성자 ID 설정
            CommentsDTO savedCommentDTO = commentsService.createComment(postId, commentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCommentDTO);
        } catch (RuntimeException e) {
            logger.error("댓글 추가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("댓글 추가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
