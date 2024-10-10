package com.example.todaktodak.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDTO {
    private Long id;
    private String userid;        // 유저 ID
    private String password;      // 비밀번호
    private String passwordCheck; // 비밀번호 확인
    private String email;         // 이메일
    private String gender;        // 성별
    private String birthDate;     // 생년월일
    private String userName;      // 이름

    public UserDTO() {}
    public UserDTO(String userid, String password, String passwordCheck, String userName, String email, String gender, String birthDate) {
        this.userid = userid;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }
    public UserDTO(Long id, String userid, String password, String passwordCheck, String userName, String email, String gender, String birthDate) {
        this.id = id;
        this.userid = userid;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }
}
