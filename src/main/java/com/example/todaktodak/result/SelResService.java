package com.example.todaktodak.result;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesService;

@Service
public class SelResService {

    private final CategoriesService categoriesService;

    public SelResService(CategoriesService categoriesService){
        this.categoriesService = categoriesService;
    }

    public List<Categories> findAllCategories(){
        return categoriesService.getAllCategories();
    }
}
