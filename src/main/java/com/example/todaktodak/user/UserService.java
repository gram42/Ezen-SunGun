package com.example.todaktodak.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// import com.example.todaktodak.community.comments.Comments;
// import com.example.todaktodak.community.comments.CommentsRepository;
// import com.example.todaktodak.community.posts.Posts;
import com.example.todaktodak.record.Record;
// import com.example.todaktodak.community.posts.PostsRepository;
import com.example.todaktodak.record.RecordRepository;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    // 회원 탈퇴를 위해 연관 기록 찾는 기능 필요
    private final RecordRepository recordRepository;
    // private final PostsRepository postsRepository;
    // private final CommentsRepository commentsRepository;

    public UserService(UserRepository userRepository, 
                        PasswordEncoder passwordEncoder, 
                        RecordRepository recordRepository
                        // PostsRepository postsRepository,
                        // CommentsRepository commentsRepository
                        ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.recordRepository = recordRepository;
        // this.postsRepository = postsRepository;
        // this.commentsRepository = commentsRepository;
    }
    

        // 현재 로그인한 사용자 정보를 가져오는 메서드
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = getUserByUserid(userDetails.getUsername());
            user.setPassword("");
            return user;
            
        }
        return null; // 현재 사용자가 없을 경우 null 반환
    }

    // userid로 유저 존재 여부 확인
    public boolean isUseridAvailable(String userid) {
        return userRepository.findByUserid(userid).isEmpty();
    }

    // 회원 가입 정보 저장
    public void registerUser(UserDTO userDTO) {

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);

        User newUser = new User();
        newUser.setUser(userDTO);

        userRepository.save(newUser);
    }

    // userid로 유저 정보 찾기
    public User getUserByUserid(String userid) {
        Optional<User> result = userRepository.findByUserid(userid);
        return result.orElse(null);
    }

    // 닉네임으로 유저 정보 찾기
    public User getUserByUserName(String userName){
        return userRepository.findByUserName(userName);
    }

    // 유저 정보 수정
    public void editUserInfo(UserDTO userDTO) {
        String password = getUserByUserid(userDTO.getUserid()).getPassword();
        String finalPassword;

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            if (passwordEncoder.matches(userDTO.getPassword(), password)) {
                finalPassword = password;
            } else {
                finalPassword = passwordEncoder.encode(userDTO.getPassword());
            }
        } else {
            finalPassword = password;
        }

        if (userDTO.getGender() == null || userDTO.getGender().equals("null")){
            userDTO.setGender(null);
        }

        User setUser = new User(userDTO.getId(),
                            userDTO.getUserid(),
                            finalPassword,
                            userDTO.getUserName(),
                            userDTO.getEmail(),
                            userDTO.getGender(),
                            userDTO.getBirthDate()
                            );

        userRepository.save(setUser);
    }

    public boolean deleteAccount(UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByUserid(userDTO.getUserid());

        if (optionalUser.isPresent()) {


            // 회원탈퇴를 위해 유저 관련 정보 삭제
            // 유저 게시물&게시물에 딸린 댓글 삭제
            deleteAllPosts(userDTO);
            
            // 유저와 댓글 관계 제거
            // setCmtsRelationshipIsNull(userDTO);

            // 유저 기록 삭제
            deleteAllRecord(userDTO);

            userRepository.delete(optionalUser.get());
            return true;
        } else {
            return false;
        }
    }

    // 유저의 모든 게시글 삭제
    public void deleteAllPosts(UserDTO userDTO){
        // List<Posts> posts = postsRepository.findByUserId(userDTO.getId());
        // postsRepository.deleteAll(posts);
    }

    // 유저의 모든 댓글 관계 제거
    // public void setCmtsRelationshipIsNull(UserDTO userDTO){
    //     List<Comments> comments = commentsRepository.findByUser_Id(userDTO.getId());
    //     for (Comments comment : comments) {
    //         comment.setUser(null);
    //     }
    //     commentsRepository.saveAll(comments);
    // }
    
    // 유저의 모든 기록 삭제
    public void deleteAllRecord(UserDTO userDTO){
        List<Record> records = recordRepository.findByCompositeIdUserid(userDTO.getUserid());
        recordRepository.deleteAll(records);
    }

}



