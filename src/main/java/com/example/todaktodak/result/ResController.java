package com.example.todaktodak.result;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ResController {

    ResService resService;
    
    public ResController(ResService resService){
        this.resService = resService;
    }
    
    @GetMapping("/ui/res")
    public String response(Model model) {

        model.addAttribute("categories", resService.findAllCategories());
        
        return "/ui/response";
    }

    @GetMapping("/ui/all_res")
    public String allRes() {
        return "/ui/all_res";
    }

    @GetMapping("/ui/book_res")
    public String bookRes() {
        return "/ui/book_res";
    }

    @GetMapping("/ui/rec")
    public String recommend() {
        return "redirect:/ui/all_res";
    }

}

