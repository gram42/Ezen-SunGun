package com.example.todaktodak.user;

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
    private Long id;

    @Column(unique = true, nullable = false)
    private String userid;

    @Column(nullable = false)
    private String password;

    private String userName;   // 사용자 이름
    private String email;         // 이메일 추가
    private String gender;        // 성별 추가
    private String birthDate;     // 생년월일 추가

    public User() {}

    public User(String userid, String password, String userName, String email, String gender, String birthDate) {
        this.userid = userid;
        this.password = password;
        this.userName = userName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public User(Long id, String userid, String password, String userName, String email, String gender, String birthDate) {
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
