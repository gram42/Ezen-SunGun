package com.example.todaktodak.send_mail;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerifiCodeService {
    
    @Autowired
    private VerifiCodeRepository verifiCodeRepository;

    public VerifiCodeService(VerifiCodeRepository verifiCodeRepository){
        this.verifiCodeRepository = verifiCodeRepository;
    }

    private final SecureRandom RANVERIFINUM = new SecureRandom(); // 규칙이 있는 random과 달리 진짜 랜덤
    Integer ranVerifiNum;

    // 인증번호 생성 100000 ~ 999999
    private Integer generateCode(){
        return 100000 + RANVERIFINUM.nextInt(900000);
    }

    // 기존 이메일 관련 인증 정보 삭제
    private void delEmailVerifiInfo(String email){
        VerifiCode verifiCode = verifiCodeRepository.findByEmail(email);
        if(verifiCode != null){
            verifiCodeRepository.deleteById(verifiCode.getId());
        }
    }

    // 인증 정보(이메일, 인증번호, 유효시간) 저장
    public void saveVerifiInfo(String email) {
        
        delEmailVerifiInfo(email);

        ranVerifiNum = generateCode();
        LocalDateTime validTime = LocalDateTime.now().plusMinutes(5);
        VerifiCode verifiCode = new VerifiCode(email, ranVerifiNum, validTime);
        
        verifiCodeRepository.save(verifiCode);
    }

    // 인증번호 리턴
    public Integer getRanVerifiNum(){
        return ranVerifiNum;
    }

    // 인증 확인
    public boolean verifiChk(String email, Integer code){

        VerifiCode verifiCode = verifiCodeRepository.findByEmail(email);
        
        if (verifiCode != null){

            boolean matchCode = verifiCode.getCode().equals(code);
            boolean beforeValidTime = LocalDateTime.now().isBefore(verifiCode.getValidTime());

            if (matchCode && beforeValidTime) {return true;}
        }

        return false;
    }
    
}
