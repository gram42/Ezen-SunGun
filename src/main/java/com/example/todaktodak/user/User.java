package com.example.todaktodak.user;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;              // 사용자 기본생성 아이디

    @Column(unique = true, nullable = false, length = 12)
    private String userid;        // 사용자 아이디

    @Column(nullable = false, length = 20)
    private String password;      // 비밀번호

    @Column(nullable = false, length = 100)
    private String email;         // 이메일

    @Column(nullable = false, length = 15)
    private String userName;      // 사용자 이름(닉네임)

    @Column(length = 5)
    private String gender;        // 성별

    @Column(length = 12)
    private LocalDate birthDate;  // 생년월일

    public User() {}

    public User(String userid, String password, String userName, String email){
        this.userid = userid;
        this.password = password;
        this.userName = userName;
        this.email = email;
    }

    public User(Long id, String userid, String password, String userName, String email) {
        this.id = id;
        this.userid = userid;
        this.password = password;
        this.userName = userName;
        this.email = email;
    }

    public User(String userid, String password, String userName, String email, String gender, LocalDate birthDate) {
        this.userid = userid;
        this.password = password;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public User(Long id, String userid, String password, String userName, String email, String gender, LocalDate birthDate) {
        this.id = id;
        this.userid = userid;
        this.password = password;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public void setUser(UserDTO userDTO){
        this.id = userDTO.getId();
        this.userid = userDTO.getUserid();
        this.password = userDTO.getPassword();
        this.userName = userDTO.getUserName();
        this.email = userDTO.getEmail();
        this.gender = userDTO.getGender();
        this.birthDate = userDTO.getBirthDate();
    }
}
