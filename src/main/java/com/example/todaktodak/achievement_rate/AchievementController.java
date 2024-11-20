package com.example.todaktodak.achievement_rate;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.todaktodak.category.Categories;





@Controller
public class AchievementController {
    @Autowired
    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService){
        this. achievementService = achievementService;
    }


    // 달성률 페이지
    @GetMapping("/achievementRate")
    public String getAchievementRate(Authentication authentication, 
                                    @RequestParam(name="p", required = true, defaultValue = "1") String pageNum, 
                                    Model model) {

        if (authentication != null && authentication.isAuthenticated()){

            int pgSize = 3; // 페이지당 요소 개수
            int sectionSize = 5; // 섹션당 페이지 수
            Integer pgNum;

            try {
                pgNum = Integer.parseInt(pageNum);
            } catch (NumberFormatException e) {
                return "redirect:/error";
            }



            List<Categories> categories = achievementService.getAllCategories();            
            List<AchievementDTO> totalInfo = achievementService.getTotalUserInfo(authentication.getName(), pgNum, pgSize);
            Map<String, Object> pgInfo = achievementService.getPgInfo(authentication.getName(), pgSize, sectionSize, pgNum);

            model.addAttribute("categories", categories);
            model.addAttribute("totalInfo", totalInfo);
            model.addAttribute("pgInfo", pgInfo);
            

            return "/user/achievementRate";
        }
        return "redirect:/user/login";
    }

    // 목표 달성률 저장
    @PostMapping("/saveAchievementGoal")
    public String postMethodName(Authentication authentication, @ModelAttribute AchievementDTO achievementDTO) {
        
        achievementService.saveAchievementGoal(authentication.getName(), achievementDTO);
        
        return "redirect:/achievementRate";
    }
    
    // 목표 달성률 삭제
    @PostMapping("/delete-achievementRate")
    public ResponseEntity<Boolean> deleteAchievementRate(@RequestBody AchievementDTO achievementDTO){

        achievementService.deleteAchievementRate(achievementDTO);

        return ResponseEntity.status(200).body(true);
    }
    
}
