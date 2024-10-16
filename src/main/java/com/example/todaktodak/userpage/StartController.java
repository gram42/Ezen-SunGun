package com.example.todaktodak.userpage;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class StartController {
    
    @GetMapping("/")
    public String getMethodName() {
        return "start";
    }
    

}
