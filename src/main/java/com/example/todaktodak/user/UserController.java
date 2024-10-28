package com.example.todaktodak.user;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public String login(Authentication authentication) {

        if ((authentication != null) && (authentication.isAuthenticated())) {
            return "redirect:/ui/index";
        }
        return "/user/login"; // 로그인 페이지 반환
    }

    @GetMapping("/mypage")
    public String mypage(Authentication authentication, Model model) {
        User user = null;
        if((authentication != null) && (authentication.isAuthenticated())){
            user = userService.getCurrentUser();
        }
        if (user != null) {
            model.addAttribute("user", user);
            return "/user/mypage"; // 마이페이지 반환
        }
        return "redirect:/user/login"; // 로그인 필요 시 로그인 페이지로 리다이렉트
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

    @PostMapping("/checkPassword")
    public ResponseEntity<String> checkPassword(@RequestBody UserDTO userDTO, Model model) {

        String password = userService.getUserByUserid(userDTO.getUserid()).getPassword();
        String inputPassword = userDTO.getPassword();

        if (passwordEncoder.matches(inputPassword, password)){

            User user = userService.getUserByUserid(userDTO.getUserid());
            model.addAttribute("user", user);

            return ResponseEntity.status(200).body("비밀번호가 확인되었습니다.");

        } else {

            return ResponseEntity.status(200).body("비밀번호가 일치하지 않습니다.");
        }
    }

    @GetMapping("/editInfo")
    public String editInfo(Authentication authentication, Model model) {

        User user = null;

        if((authentication != null) && (authentication.isAuthenticated())){
            user = userService.getCurrentUser();
        }

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


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return ResponseEntity.ok("로그아웃 성공");
    }
}
