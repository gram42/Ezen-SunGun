package com.example.todaktodak.record;

import java.time.LocalDate;
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

            LocalDate today = LocalDate.now();

            if (date != null){
                
                LocalDate selectDate = LocalDate.parse(date);

                if (selectDate.isAfter(today)){
                    return "redirect:/error";
                }
                else{

                    List<Record> userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), selectDate);
                    model.addAttribute("userRecords", userRecords);
                    model.addAttribute("date", selectDate);

                }

            }
            else{

                List<Record> userRecords = recordService.getUserRecordByUseridAndRecordedDate(authentication.getName(), today);
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

    // // 그래프 출력
    // @GetMapping("/mypage2")
    // public String graph(Authentication authentication, Model model) {

    //     if((authentication != null) && (authentication.isAuthenticated())){
    //         List<RecordDTO> categoryIdAndPoint = recordService.getAllPoint(authentication.getName());
    //         model.addAttribute("categoryId", categoryIdAndPoint.getCategoryId(););
    //         model.addAttribute("points", categoryIdAndPoint.getPoint(););
    //     }

    //     return "/record/mypage2";
    // }
    


}
