package com.example.todaktodak.community;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommunityController {

    @GetMapping("/community/community")
    public String community() {
        return "community/community";
    }
  
    @GetMapping("/community/writing")
    public String writing() {
        return "community/writing";
    }
    
    @GetMapping("/community/my-posts")
    public String my_posts() {
        return "community/my-posts";
    }
    
    @GetMapping("/community/my-comments")
    public String my_comments() {
        return "community/my-comments";
    }
}
