package com.example.todaktodak.record;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;




@Controller
public class RecordController {
    @Autowired
    private final RecordService recordService;

    public RecordController(RecordService recordService){
        this.recordService = recordService;
    }
    
    // 기록 창 접속 - 오늘 기록 리턴, 날짜 입력 접속 - 날짜 기록 리턴
    @GetMapping("/record")
    public String record(Authentication authentication, Model model, @RequestParam(name = "date", required = false) String date) {
        
        if((authentication != null) && (authentication.isAuthenticated())) {

            LocalDate selectDate;
            List<Record> userRecords;
            LocalDate today = LocalDate.now();

            if (date != null){
                
                try {
                    selectDate = LocalDate.parse(date);
                }
                catch (DateTimeParseException e) {
                    return "redirect:/error";
                }
                
                if (selectDate.isAfter(today)){
                    return "redirect:/error";
                }
                else{

                    userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), selectDate);
                    model.addAttribute("userRecords", userRecords);
                    model.addAttribute("date", selectDate);

                }

            }
            else{

                userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), today);
                model.addAttribute("userRecords", userRecords);
                model.addAttribute("date", today);

            }
        } 
        return "/record/record";
    }

    // 체크박스 선택시 포인트 증가
    @PostMapping("/record/checkbox")
    public ResponseEntity<String> recordCheckbox(@RequestBody RecordDTO recordDTO) {

        RecordCompositeId compositeId = recordDTO.getCompositeId();
        Integer point = recordDTO.getPoint();
        
        recordService.setPoint(compositeId, point);

        
        return ResponseEntity.status(200).body("Success");
    }

    // 본문 기록
    @PostMapping("/record/content")
    public ResponseEntity<String> recordContent(@RequestBody RecordDTO recordDTO) {

        RecordCompositeId compositeId = recordDTO.getCompositeId();
        String content = recordDTO.getContent();

        recordService.setContent(compositeId, content);
        
        return ResponseEntity.status(200).body("Success");
    }


    // *주의* 추후 메소드 위치 옮길 것 -> user 폴더로, mypage2 -> mypage로 바꿀 것
    // 마이페이지 접속 - 포인트 값 리턴(주 단위, 약 5주), 기본 접속 - 전체 포인트 리턴
    @GetMapping("/mypage2")
    public String mypage2(Authentication authentication, Model model) {
        
        List<Record> points;

        if((authentication != null) && (authentication.isAuthenticated())){

            points = recordService.getTotalPointsByWeeks(authentication.getName());
            
            model.addAttribute("pointsInfo", points); // 받아온 데이터 넣기
        }

        return "/record/mypage2";
    }


    // post 매핑 - 카테고리 선택 시 입력한 카테고리 포인트 리턴, ajax 통신 예정
    


}
