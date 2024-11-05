package com.example.todaktodak.send_mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
public class VerifiCodeController {
    
    @Autowired
    VerifiCodeService verifiCodeService;

    @Autowired
    EmailService emailService;

    public VerifiCodeController(VerifiCodeService verifiCodeService, EmailService emailService){
        this.verifiCodeService = verifiCodeService;
        this.emailService = emailService;
    }

    // 인증번호 보내주기 && 인증 정보 저장
    @PostMapping("/codePlz")
    public void sendCode(@ModelAttribute VerifiCode verifiCodeInfo) {

        verifiCodeService.saveVerifiInfo(verifiCodeInfo.getEmail());
        Integer ranVerifiCode = verifiCodeService.getRanVerifiNum();
        emailService.sendVerifiEmail(verifiCodeInfo.getEmail(), Integer.toString(ranVerifiCode));

    }

    // 인증 확인
    @PostMapping("/chkVerifi")
    public ResponseEntity<Boolean> chkVerifi(@RequestBody VerifiCode verifiCode) {

            boolean verifiRes = verifiCodeService.verifiChk(verifiCode.getEmail(), verifiCode.getCode());
            return ResponseEntity.status(200).body(verifiRes);

    }
}
