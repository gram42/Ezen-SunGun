package com.example.todaktodak.send_mail;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerifiCodeRepository extends JpaRepository<VerifiCode, Long> {

    VerifiCode findByEmail(String email); // 이메일로 인증번호 찾기

}
