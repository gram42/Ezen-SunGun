package com.example.todaktodak.interest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesDTO;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;






@Controller
public class InterestController {

    @Autowired
    private final InterestService interestService;

    public InterestController(InterestService interestService){
        this.interestService = interestService;
    }
    
    // 관심사 설정창 요청
    @GetMapping("/interest")
    public String interest(Authentication authentication, Model model) {

        if(authentication != null && authentication.isAuthenticated()){

            List<Categories> categories =  interestService.getAllCategories();
            List<CategoriesDTO> interests = interestService.getUserInterests(authentication.getName());


            model.addAttribute("categories", categories);
            model.addAttribute("interests", interests);
            return "/user/interest";
        }
        return "redirect:/user/login";

    }

    // 관심사 저장 요청
    @PostMapping("/saveInterests")
    public String saveInterests(Authentication authentication, @ModelAttribute InterestDTO interestDTO) {
        
        interestService.saveInterests(authentication.getName(), interestDTO.getCategories());

        return "redirect:/ui/main";
    }
    
    // 저장한 관심사 요청
    @PostMapping("/userInterestsPlz")
    public ResponseEntity<List<String>> postMethodName(Authentication authentication) {
        
        List<String> interestsCategories = new ArrayList<>();

        if (authentication != null && authentication.isAuthenticated()){
            interestsCategories = interestService.getUserInterestsStr(authentication.getName());
        }

        return ResponseEntity.status(200).body(interestsCategories);
    }
    
    
}
