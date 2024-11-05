package com.example.todaktodak.result;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SelResController {

    SelResService resService;
    
    public SelResController(SelResService resService){
        this.resService = resService;
    }
    
    @GetMapping("/ui/select")
    public String select(Model model) {
        model.addAttribute("categories", resService.findAllCategories());
        return "/ui/select";
    }

    @GetMapping("/ui/result")
    public String result() {
        return "/ui/result";
    }

    @PostMapping("/ui/result")
    public String handleCategorySelection(@RequestParam(value = "interest", required = false) List<String> interests, Model model) {
    
        // interests가 null일 경우 빈 리스트로 초기화하여 NPE 방지
        if (interests == null) {
            interests = new ArrayList<>();
            }
        model.addAttribute("selectedCategories", interests);
        return "ui/result";  // templates 폴더의 result.html을 보여줌
        }
    
}