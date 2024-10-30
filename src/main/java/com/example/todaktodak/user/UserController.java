package com.example.todaktodak.user;

import java.security.Principal;

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
import org.springframework.web.bind.annotation.RequestParam;

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

    @GetMapping("/register")
    public String user() {
        return "/user/register"; // 사용자 등록 페이지 반환
    }

    @GetMapping("/login")
    public String login() {
        return "/user/login"; // 로그인 페이지 반환
    }

    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
            return "/user/mypage"; // 마이페이지 반환
        }
        return "redirect:/user/login"; // 로그인 필요 시 로그인 페이지로 리다이렉트
    }

    @PostMapping("/login")
public ResponseEntity<String> login(@RequestBody UserDTO userDTO, HttpSession session) {
    User user = userService.getUserByUserid(userDTO.getUserid());

    // 사용자 인증 확인
    if (user != null && passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
        session.setAttribute("user", user); // 세션에 사용자 정보 설정
        System.out.println("로그인한 사용자: " + user.getUserid()); // 디버그 로그
        return ResponseEntity.ok("로그인 성공");
    } else {
        System.out.println("로그인 실패: 사용자 ID 또는 비밀번호가 잘못되었습니다."); // 디버그 로그
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
    }
}



@GetMapping("/current")
public ResponseEntity<User> getCurrentUser(Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    User user = userService.findByUsername(principal.getName());
    return ResponseEntity.ok(user);
}



    @GetMapping("/check-userid")
    public ResponseEntity<Boolean> checkUserid(@RequestParam String userid) {
        boolean isAvailable = userService.isUseridAvailable(userid);
        return ResponseEntity.ok(isAvailable); // 사용자 ID 가용성 체크
    }

    @PostMapping("/join")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        try {
            if (!userService.isUseridAvailable(userDTO.getUserid())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 ID입니다.");
            }
            userService.registerUser(userDTO); // 사용자 등록
            return ResponseEntity.ok("회원가입에 성공하였습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/editInfo")
    public String editInfo(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
        }
        return "/user/editInfo"; // 사용자 정보 수정 페이지 반환
    }

    @PostMapping("/retouch")
    public String retouch(@ModelAttribute UserDTO userDTO) {
        userService.editUserInfo(userDTO); // 사용자 정보 수정
        return "redirect:/user/mypage"; // 수정 후 마이페이지로 리다이렉트
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody UserDTO userDTO, HttpSession session) {
        boolean result = userService.deleteAccount(userDTO);

        if (result) {
            session.invalidate(); // 세션 무효화
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
    

    @PostMapping("/logout")
public ResponseEntity<String> logout(HttpSession session) {
    session.invalidate(); // 세션 무효화
    return ResponseEntity.ok("로그아웃 성공");
}
}
