package com.example.todaktodak.userpage;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;





@Controller
public class MainController {

    @GetMapping({"/ui/main","/ui/index"})
    public String main() {
        return "/ui/index";
    }
    
}
