package com.example.todaktodak.achievement_rate;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
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

            List<Categories> categories = achievementService.getAllCategories();            
            List<AchievementDTO> totalInfo = achievementService.getTotalUserInfo(authentication.getName());

            model.addAttribute("categories", categories);
            model.addAttribute("totalInfo", totalInfo);
            

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
    
    
    
}
