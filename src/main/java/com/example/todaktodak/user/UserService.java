package com.example.todaktodak.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.todaktodak.achievement_rate.Achievement;
import com.example.todaktodak.achievement_rate.AchievementRepository;
import com.example.todaktodak.community.comments.Comments;
import com.example.todaktodak.community.comments.CommentsRepository;
import com.example.todaktodak.community.posts.Posts;
import com.example.todaktodak.record.Record;
import com.example.todaktodak.community.posts.PostsRepository;
import com.example.todaktodak.interest.Interest;
import com.example.todaktodak.interest.InterestRepository;
import com.example.todaktodak.record.RecordRepository;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    // 회원 탈퇴를 위해 연관 기록 찾는 기능 필요
    private final RecordRepository recordRepository;
    private final PostsRepository postsRepository;
    private final CommentsRepository commentsRepository;
    private final InterestRepository interestRepository;
    private final AchievementRepository achievementRepository;

    public UserService(UserRepository userRepository, 
                        PasswordEncoder passwordEncoder, 
                        RecordRepository recordRepository,
                        PostsRepository postsRepository,
                        CommentsRepository commentsRepository,
                        InterestRepository interestRepository,
                        AchievementRepository achievementRepository
                        ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.recordRepository = recordRepository;
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.interestRepository = interestRepository;
        this.achievementRepository = achievementRepository;
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

        if (userDTO.getGender() == null || userDTO.getGender().equals("null")){
            userDTO.setGender(null);
        }

        User setUser = new User(userDTO.getId(),
                            userDTO.getUserid(),
                            password,
                            userDTO.getUserName(),
                            userDTO.getEmail(),
                            userDTO.getGender(),
                            userDTO.getBirthDate()
                            );

        userRepository.save(setUser);
    }

    // 비밀번호 찾을 유저 찾기
    public User findUserByEmainAndUserid(String email, String userid){
        Optional<User> optionalUser = userRepository.findByEmailAndUserid(email, userid);
        if (optionalUser.isPresent()){
            User user = optionalUser.get();
            return user;
        }
        return null;
    }

    // 비밀번호 수정
    public boolean chngPw(String email, String userid, String password){

        Optional<User> optionalUser = userRepository.findByEmailAndUserid(email, userid);
        
        if (optionalUser.isPresent()){
            User user = optionalUser.get();

            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return true;

        }
        return false;
    }

    // 비밀번호 수정(로그인)
    public boolean chngPwWhenLogin(String userid, UserDTO userDTO){

        Optional<User> optionalUser = userRepository.findByUserid(userid);
        
        if (optionalUser.isPresent()){
            User user = optionalUser.get();

            if (passwordEncoder.matches(userDTO.getBeforePw(), user.getPassword())){

                return chngPw(user.getEmail(), user.getUserid(), userDTO.getPassword());

            }
            return false;
        }
        return false;
    }

    // 비밀번호 수정(비밀번호 찾기)
    public boolean chngPwWhenFindPw(String email, String userid, UserDTO userDTO){
        Optional<User> optionalUser = userRepository.findByEmailAndUserid(email, userid);

        if (optionalUser.isPresent()){
            User user = optionalUser.get();
            
            return chngPw(user.getEmail(), user.getUserid(), userDTO.getPassword());
            
        }
        return false;
    }


    // 회원 탈퇴
    public boolean deleteAccount(UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByUserid(userDTO.getUserid());

        if (optionalUser.isPresent()) {


            // 회원탈퇴를 위해 유저 관련 정보 삭제
            // 유저 게시물&게시물에 딸린 댓글 삭제
            deleteAllPosts(userDTO);
            
            // 유저와 댓글 관계 제거
            setCmtsRelationshipIsNull(userDTO);

            // 유저 기록 삭제
            deleteAllRecord(userDTO);

            // 유저 관심사 삭제
            deleteInterests(userDTO);

            // 유저 달성률 삭제
            deleteAllAchievement(userDTO);

            userRepository.delete(optionalUser.get());
            return true;
        } else {
            return false;
        }
    }

    // 유저의 모든 게시글 삭제
    public void deleteAllPosts(UserDTO userDTO){
        List<Posts> posts = postsRepository.findByUserId(userDTO.getId());
        postsRepository.deleteAll(posts);
    }

    // 유저의 모든 댓글 관계 제거
    public void setCmtsRelationshipIsNull(UserDTO userDTO){
        List<Comments> comments = commentsRepository.findByUser_Id(userDTO.getId());
        for (Comments comment : comments) {
            comment.setUser(null);
        }
        commentsRepository.saveAll(comments);
    }

    // 유저 관심 분야 삭제

    public void deleteInterests(UserDTO userDTO){
        List<Interest> interests = interestRepository.findByCompositeIdUserid(userDTO.getUserid());
        interestRepository.deleteAll(interests);
    }
    
    
    // 유저의 모든 기록 삭제
    public void deleteAllRecord(UserDTO userDTO){
        List<Record> records = recordRepository.findByCompositeIdUserid(userDTO.getUserid());
        recordRepository.deleteAll(records);
    }
    
    // 유저의 모든 달성률 삭제
    public void deleteAllAchievement(UserDTO userDTO){
        Optional<User> optionalUser = userRepository.findByUserid(userDTO.getUserid());
        User user = optionalUser.get();
        List<Achievement> achievements = achievementRepository.findByUser(user);
        achievementRepository.deleteAll(achievements);
    }

    // 이메일로 유저 찾기(id/pw 찾기 용)
    public List<UserDTO> getUserByEmail(String email){

        List<UserDTO> useridList = new ArrayList<>();

        List<User> userList = userRepository.findByEmail(email);

        for (User userInfo : userList) {
            useridList.add(new UserDTO(userInfo.getUserid()));
        }

        return useridList;
    }


}
