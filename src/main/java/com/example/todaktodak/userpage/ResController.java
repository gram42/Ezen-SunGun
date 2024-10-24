package com.example.todaktodak.userpage;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;










@Controller
public class ResController {
    
    @GetMapping("/ui/res")
    public String response() {
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

    @GetMapping("/community/community")
    public String community() {
        return "community/community";
    }
    
   @GetMapping("/community/postDetail/{postId}")
    public String postDetail(@PathVariable Long postId, Model model) {
    model.addAttribute("postId", postId); // postId를 모델에 추가
    return "/community/postDetail"; // HTML 파일 경로
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
