package com.example.todaktodak.record;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

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
    
    public static final LocalDate TODAY = LocalDate.now();

    public RecordController(RecordService recordService){
        this.recordService = recordService;
    }
    
    // 기록 창 접속 - 오늘 기록 리턴, 날짜 입력 접속 - 날짜 기록 리턴
    @GetMapping("/record")
    public String record(Authentication authentication, Model model, @RequestParam(name = "date", required = false) String date) {
        
        if((authentication != null) && (authentication.isAuthenticated())) {

            LocalDate selectDate;
            List<Record> userRecords;

            if (date != null){
                
                try {
                    selectDate = LocalDate.parse(date);
                }
                catch (DateTimeParseException e) {
                    return "redirect:/error";
                }
                
                if (selectDate.isAfter(TODAY)){
                    return "redirect:/error";
                }
                else{

                    userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), selectDate);
                    model.addAttribute("userRecords", userRecords);
                    model.addAttribute("date", selectDate);

                }

            }
            else{

                userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), TODAY);
                model.addAttribute("userRecords", userRecords);
                model.addAttribute("date", TODAY);

            }
            return "/record/record";
        }
        return "redirect:/user/login";
    }

    // 체크박스 체크여부에 다라 포인트 증감
    @PostMapping("/record/checkbox")
    public ResponseEntity<String> recordCheckbox(@RequestBody RecordDTO recordDTO) {

        RecordCompositeId compositeId = recordDTO.getCompositeId();
        Integer point = recordDTO.getPoint();
        
        recordService.setPoint(compositeId, point);

        
        return ResponseEntity.status(200).body("Success");
    }

    // 본문 기록
    @PostMapping("/record/saveContent")
    public ResponseEntity<String> recordContent(@RequestBody RecordDTO recordDTO) {

        RecordCompositeId compositeId = recordDTO.getCompositeId();
        String content = recordDTO.getContent();

        recordService.setContent(compositeId, content);
        
        return ResponseEntity.status(200).body("Success");
    }

    // 마이페이지 접속 - 포인트 값 리턴, 기본 접속 - 카테고리별 포인트 전부 리턴
    @GetMapping("/mypage")
    public String mypage(Authentication authentication, Model model) {

        if((authentication != null) && (authentication.isAuthenticated())){

            Map<String, List<Integer>> pointsByWeeks = recordService.getPointsByDaysAndCategory(authentication.getName());
            Integer totalPoint = recordService.getTotalPointsByDays(authentication.getName());
            Map<String, List<Integer>> pointsByMonths = recordService.getPointsByMonthsAndCategory(authentication.getName());
            
            model.addAttribute("pointsByDays", pointsByWeeks);
            model.addAttribute("totalPoint", totalPoint);
            model.addAttribute("pointsByMonths", pointsByMonths);
        }

        return "/record/mypage-kmg";
    }
    


}
