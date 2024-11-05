package com.example.todaktodak.send_mail;

import java.time.LocalDateTime;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter
@ToString
public class VerifiCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email; // 인증 이메일

    @Column(nullable = false)
    private Integer code; // 인증번호

    @Column(nullable = false)
    private LocalDateTime validTime; // 유효시간

    public VerifiCode() {
    }

    public VerifiCode(String email, Integer code, LocalDateTime validTime) {
        this.email = email;
        this.code = code;
        this.validTime = validTime;
    }

    public VerifiCode(Long id, String email, Integer code, LocalDateTime validTime) {
        this.id = id;
        this.email = email;
        this.code = code;
        this.validTime = validTime;
    }
}
