package com.example.todaktodak.user;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;



@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private final UserService userService;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // 회원가입 페이지
    @GetMapping("/register")
    public String user() {
        return "/user/register";
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String login(Authentication authentication) {

        if ((authentication != null) && (authentication.isAuthenticated())) {
            return "redirect:/ui/index"; // 로그인 후 다시 로그인 요청하면 메인페이지 리다이렉트
        }
        return "/user/login"; // 로그인 페이지 반환
    }

    // 개인정보 페이지
    @GetMapping("/userInfo")
    public String userInfo(Authentication authentication, Model model) {
        User user = null;
        if((authentication != null) && (authentication.isAuthenticated())){
            user = userService.getCurrentUser();
        }
        if (user != null) {
            model.addAttribute("user", user);
            return "/user/userInfo"; // 개인정보 페이지 반환
        }
        return "redirect:/user/login"; // 로그인 필요 시 로그인 페이지로 리다이렉트
    }

    // 현재 이용중인 사용자 정보 불러오기
    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.getUserByUserid(principal.getName());
        return ResponseEntity.ok(user);
    }

    // 유저 아이디 중복 체크
    @PostMapping("/check-userid")
    public ResponseEntity<Boolean> checkUserid(@RequestBody UserDTO userDTO) {
        boolean isAvailable = userService.isUseridAvailable(userDTO.getUserid());
        return ResponseEntity.ok(isAvailable); // 사용자 ID 가용성 체크
    }

    // 유저 닉네임 중복 체크
    @PostMapping("/chkNicknm")
    public ResponseEntity<Boolean> chkUserName(@RequestBody UserDTO userDTO) {

        User user = userService.getUserByUserName(userDTO.getUserName());
        if(user != null){
            return ResponseEntity.status(200).body(true);
        }
        
        return ResponseEntity.status(200).body(false);
    }
    

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {

        User user = userService.getUserByUserName(userDTO.getUserName());

        try {

            if (!userService.isUseridAvailable(userDTO.getUserid())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 ID입니다.");
            } else if(user != null){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 닉네임입니다.");
            }

            userService.registerUser(userDTO); // 사용자 등록

            return ResponseEntity.status(200).body("register Success");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 비밀번호 확인
    @PostMapping("/checkPassword")
    public ResponseEntity<String> checkPassword(Authentication authentication, @RequestBody UserDTO userDTO, Model model) {

        String password = userService.getUserByUserid(authentication.getName()).getPassword();
        String inputPassword = userDTO.getPassword();

        if (passwordEncoder.matches(inputPassword, password)){

            User user = userService.getUserByUserid(userDTO.getUserid());
            model.addAttribute("user", user);

            return ResponseEntity.status(200).body("비밀번호가 확인되었습니다.");

        } else {

            return ResponseEntity.status(200).body("비밀번호가 일치하지 않습니다.");
        }
    }

    
    // 개인정보 수정 페이지
    @GetMapping("/editInfo")
    public String editInfo(Authentication authentication, Model model) {
        
        if (authentication != null && authentication.isAuthenticated()){

            User user = null;
            
            if((authentication != null) && (authentication.isAuthenticated())){
                user = userService.getCurrentUser();
            }
            
            if (user != null) {
                model.addAttribute("user", user);
            }
            return "/user/editInfo"; // 사용자 정보 수정 페이지 반환
        }
        return "redirect:/user/login";
    }
    
    // 개인정보 수정
    @PostMapping("/retouch")
    public String retouch(@ModelAttribute UserDTO userDTO) {
        userService.editUserInfo(userDTO); // 사용자 정보 수정
        return "redirect:/user/userInfo"; // 수정 후 개인 정보 페이지로 리다이렉트
    }
    
    // 비밀번호 찾기 페이지
    @GetMapping("/findPw")
    public String findPassword() {
        return "/user/findPw";
    }
    
    // 비밀번호 찾기 정보 저장 요청
    @PostMapping("/saveFindPwInfo")
    public ResponseEntity<Boolean> postMethodName(@RequestBody UserDTO userDTO, HttpSession session) {
        
        User user = userService.findUserByEmainAndUserid(userDTO.getEmail(), userDTO.getUserid());

        if (user != null) {
            session.setAttribute("email", user.getEmail());
            session.setAttribute("userid", user.getUserid());
            return ResponseEntity.ok().body(true);
        }
        return ResponseEntity.status(200).body(false);
        
    }
    
    
    // 비밀번호 수정 페이지
    @GetMapping("/chngPw")
    public String getMethodName(Authentication authentication) {

            return "/user/chngPw";

    }

    // 비밀번호 변경
    @PostMapping("/chngPw")
    public ResponseEntity<Boolean> changePw(Authentication authentication, @RequestBody UserDTO userDTO, HttpSession session) {
        boolean chngPw = false;

        // 로그인 했을 경우
        if((authentication != null) && (authentication.isAuthenticated())){
            chngPw = userService.chngPwWhenLogin(authentication.getName(), userDTO);
            return ResponseEntity.ok().body(chngPw);
            
        }
        // 비밀번호 찾기로 들어왔을 경우
        else {
            chngPw = userService.chngPwWhenFindPw((String)session.getAttribute("email"), (String)session.getAttribute("userid"), userDTO);
            return ResponseEntity.ok().body(chngPw);
        }
    }
    
    

    // 탈퇴 후 세션, 쿠키 정리
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody UserDTO userDTO, HttpServletRequest request, HttpServletResponse response) {

        boolean result = userService.deleteAccount(userDTO);

        if (result) {

            request.getSession().invalidate();

            Cookie cookie = new Cookie("JSESSIONID", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);

            return ResponseEntity.ok("탈퇴가 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
    }


 // 현재 인증된 사용자 정보를 가져오는 메소드
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // 사용자 세부정보를 반환 (User 클래스에 사용자 이름을 받아들이는 생성자가 있어야 함)
            return (User) authentication.getPrincipal(); // User 클래스로 캐스팅
        }
        return null; // 인증된 사용자가 없음
    }

    @GetMapping("/user/current")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = getCurrentAuthenticatedUser();
        if (currentUser != null) {
            return ResponseEntity.ok("사용자가 로그인 상태입니다."); // 필요한 경우 사용자 객체를 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자가 로그인하지 않았습니다.");
        }
    }

    // id 찾기 페이지 요청
    @GetMapping("/findId")
    public String getMethodName() {
        return "/user/findId";
    }
    

    // id 찾기 이메일 활용
    @PostMapping("/getUseridByEmail")
    public ResponseEntity<List<UserDTO>> postMethodName(@RequestBody UserDTO userDTO) {

        List<UserDTO> useridList = userService.getUserByEmail(userDTO.getEmail());

        return ResponseEntity.status(200).body(useridList);
    }
    
    

}
