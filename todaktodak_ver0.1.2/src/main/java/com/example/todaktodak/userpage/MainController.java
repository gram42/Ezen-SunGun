package com.example.todaktodak.userpage;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
public class MainController {

    @GetMapping("/ui/main")
    public String main() {
        return "/ui/main";
    }

    @GetMapping("/ui/res")
    public String response() {
        return "/ui/response";
    }
    
    
    
}
