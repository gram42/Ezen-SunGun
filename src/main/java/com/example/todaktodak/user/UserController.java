package com.example.todaktodak.user;

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
        return "/user/register";
    }

    @GetMapping("/login")
    public String login() {
        return "/user/login";
    }

    @GetMapping("/mypage")
    public String mypage(Authentication authentication, Model model) {

        if ((authentication != null) && (authentication.isAuthenticated())) {
            User user = this.userService.getUserByUserid(authentication.getName());
            user.setPassword("");
            model.addAttribute("user", user);
        } 
        return "/user/mypage";

    }
    

    @GetMapping("/check-userid")
    public ResponseEntity<Boolean> checkUserid(@RequestParam String userid) {
        boolean isAvailable = userService.isUseridAvailable(userid);
        return ResponseEntity.ok(isAvailable);
    }

    @PostMapping("/join")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        try {
            if (!userService.isUseridAvailable(userDTO.getUserid())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 ID입니다.");
            }
            userService.registerUser(userDTO);
            return ResponseEntity.ok("회원가입에 성공하였습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/checkPassword")
    public ResponseEntity<String> checkPassword(@RequestBody UserDTO userDTO, HttpSession session) {

        String password = userService.getUserByUserid(userDTO.getUserid()).getPassword();
        String inputPassword = userDTO.getPassword();

        if (passwordEncoder.matches(inputPassword, password)){

            User user = userService.getUserByUserid(userDTO.getUserid());
            session.setAttribute("user", user);

            return ResponseEntity.status(200).body("비밀번호가 확인되었습니다.");

        } else {

            return ResponseEntity.status(200).body("비밀번호가 일치하지 않습니다.");
        }
    }

    @GetMapping("/editInfo")
    public String editInfo(HttpSession session, Model model) {

        Object userObj = session.getAttribute("user");
        if (userObj instanceof User) {
            User user = (User) userObj;
            model.addAttribute("user", user);
        }

        return "/user/editInfo";
    }
    

    @PostMapping("/retouch")
    public String retouch(@ModelAttribute UserDTO userDTO) {
        
        userService.editUserInfo(userDTO);
        
        return "redirect:/user/mypage";
    }
    
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestBody UserDTO userDTO, HttpSession session) {
        
        boolean result = userService.deleteAccount(userDTO);

        if (result == true){

            session.invalidate();
            return ResponseEntity.ok("탈퇴가 완료되었습니다.");

        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");

        }

    }
    
    
    

    
}
