package com.example.todaktodak.send_mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    // 메일 보내기
    public void sendVerifiEmail(String email, String code){
        
        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(email);
        mail.setSubject("SUN 회원가입 인증번호");
        mail.setText("[ "+ code + " ] 입니다.");
        mailSender.send(mail);
    }
}
