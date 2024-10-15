package com.example.todaktodak.category;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Controller
public class CategoriesController {
    @Autowired
    CategoriesService categoriesService;

    public CategoriesController(){}
    public CategoriesController(CategoriesService categoriesService){
        this.categoriesService = categoriesService;
    }

    // 카테고리 접속시 카테고리 목록 창
    @GetMapping("/categories")
    public String categories(Model model) {

        List<Categories> categories = categoriesService.getAllCategories();

        model.addAttribute("categories", categories);

        return "/categories/categories";

    }

    // 카테고리 추가
    @PostMapping("/category/add")
    public ResponseEntity<String> addCategory(@RequestBody Categories categories) {
        
        categoriesService.add(categories);
        
        return ResponseEntity.status(200).body("Success add category");
    }
    
    // 카테고리 수정
    @PostMapping("/category/edit")
    public ResponseEntity<String> editCategory(@RequestBody CategoriesDTO categoriesDTO) {

        if (categoriesService.edit(categoriesDTO)){
            return ResponseEntity.status(200).body("Success");
        } else {
            return ResponseEntity.status(200).body("Fail");
        }
        
    }
    
    
}
