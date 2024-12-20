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
import org.thymeleaf.util.StringUtils;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;



import java.security.Principal;
import java.util.Collections;
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

    // 유저 ID로 게시글을 가져오는 API (페이지네이션 포함)  (내가 쓴 게시물 목록)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPosts(@PathVariable(name = "userId") Long userId, Pageable pageable) {
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

    // 모든 게시글 조회 (페이지네이션 적용) (커뮤니티 게시글)
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
    public ResponseEntity<PostsDTO> getPostById(@PathVariable(name = "postId") Long postId) {
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
    public ResponseEntity<PostsDTO> updatePost(@PathVariable(name = "postId") Long postId, @RequestBody PostsDTO postDTO) {
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
    public ResponseEntity<Void> deletePost(@PathVariable(name = "postId") Long postId) {
        postsService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // 게시글에 대한 댓글 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<Map<String, Object>> getCommentsByPostId(
            @PathVariable Long postId, 
            Pageable pageable) { 
        Page<CommentsDTO> commentsPage = commentsService.getCommentsByPostId(postId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("comments", commentsPage.getContent());
        response.put("total", commentsPage.getTotalElements());
        response.put("currentPage", commentsPage.getNumber());
        response.put("totalPages", commentsPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // 댓글 추가
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentsDTO> addComment(@PathVariable(name = "postId") Long postId, @RequestBody CommentsDTO commentDTO, Principal principal) {
        if (principal == null) {
            // 로그인하지 않은 사용자
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        try {
            // 로그인한 사용자 정보를 가져옴
            User user = userService.getUserByUserid(principal.getName());
            commentDTO.setUserId(user.getId()); // 댓글 작성자 ID 설정
            CommentsDTO savedCommentDTO = commentsService.createComment(postId, commentDTO, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCommentDTO);
        } catch (RuntimeException e) {
            logger.error("댓글 추가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("댓글 추가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
 // 게시글 디테일 조회
 @GetMapping("/postDetail/{postId}")
 public ResponseEntity<PostsDTO> viewPostDetail(@PathVariable Long postId) {
     Posts post = postsService.getPostById(postId);
     if (post == null) {
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



 // 게시물 찾기
 @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String comment,
            Pageable pageable) {

        // URL 디코딩
        try {
            if (title != null) {
                title = URLDecoder.decode(title, StandardCharsets.UTF_8.name());
            }
            if (author != null) {
                author = URLDecoder.decode(author, StandardCharsets.UTF_8.name());
            }
            if (comment != null) {
                comment = URLDecoder.decode(comment, StandardCharsets.UTF_8.name());
            }
        } catch (Exception e) {
         logger.error("URL 디코딩 중 오류 발생: {}", e.getMessage(), e);
         return ResponseEntity.badRequest().body(Collections.singletonMap("error", "잘못된 검색 조건입니다."));
     }
 
     // 검색 조건 검증
     if (StringUtils.isEmpty(title) && 
         StringUtils.isEmpty(author) && 
         StringUtils.isEmpty(comment)) {
         logger.warn("검색 조건이 없습니다.");
         return ResponseEntity.badRequest().body(Collections.singletonMap("error", "검색 조건이 필요합니다."));
     }
 
     logger.info("Received search request with title: '{}', author: '{}', comment: '{}'", title, author, comment);
     
     // 페이지 정보 로그
     logger.info("Page number: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
     
     // 개별 검색 조건 로그
     if (!StringUtils.isEmpty(title)) {
         logger.info("Searching by title: '{}'", title);
     }
     if (!StringUtils.isEmpty(author)) {
         logger.info("Searching by author: '{}'", author);
     }
     if (!StringUtils.isEmpty(comment)) {
         logger.info("Searching by comment: '{}'", comment);
     }
 
     try {
         Page<Posts> postsPage = postsService.searchPosts(title, author, comment, pageable);
         logger.info("Search results: {} posts found", postsPage.getTotalElements()); // 결과 개수 로그
         
         List<PostsDTO> postsDTOs = postsPage.getContent().stream()
                 .map(post -> new PostsDTO(
                         post.getPostId(),
                         post.getUser().getId(),
                         post.getTitle(),
                         post.getContent(),
                         post.getCreatedAt(),
                         postsService.getCommentCountByPost(post),
                         post.getUser().getUserName()))
                 .collect(Collectors.toList());
 
         Map<String, Object> response = new HashMap<>();
         response.put("content", postsDTOs);
         response.put("totalElements", postsPage.getTotalElements());
         response.put("totalPages", postsPage.getTotalPages());
         response.put("currentPage", postsPage.getNumber());
 
         return ResponseEntity.ok(response);
     } catch (Exception e) {
         logger.error("게시물 검색 중 오류 발생: {}", e.getMessage(), e);
         Map<String, Object> errorResponse = new HashMap<>();
         errorResponse.put("error", "게시물 검색 중 오류 발생: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
     }
 }
 
 
}