package com.example.todaktodak.userpage;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ResController {
    
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
        return "/ui/all_res";
    }

}
