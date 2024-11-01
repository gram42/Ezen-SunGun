package com.example.todaktodak.user;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDTO {
    private Long id;              // 사용자 ID
    private String userid;        // 유저 ID
    private String password;      // 비밀번호
    private String passwordCheck; // 비밀번호 확인
    private String email;         // 이메일
    private String gender;        // 성별
    private LocalDate birthDate;     // 생년월일
    private String userName;      // 이름

    // 기본 생성자
    public UserDTO() {}

    // User 객체를 매개변수로 받는 생성자 추가
    public UserDTO(User user) {
        this.id = user.getId();
        this.userid = user.getUserid();
        this.password = ""; // 보안상의 이유로 비밀번호를 비워둘 수 있음
        this.userName = user.getUserName();
        // this.email = user.getEmail();
        this.gender = user.getGender();
        this.birthDate = user.getBirthDate();
    }

    // 기존 생성자들
    public UserDTO(String userid, String password, String passwordCheck, String userName, String email, String gender, LocalDate birthDate) {
        this.userid = userid;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public UserDTO(Long id, String userid, String password, String passwordCheck, String userName, String email, String gender, LocalDate birthDate) {
        this.id = id;
        this.userid = userid;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }
    public UserDTO(String userid, String password, String userName){
        this.userid = userid;
        this.password = password;
        this.userName = userName;
    }
}
