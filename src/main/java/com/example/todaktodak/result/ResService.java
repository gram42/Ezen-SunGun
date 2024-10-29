package com.example.todaktodak.result;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesService;

@Service
public class ResService {

    CategoriesService categoriesService;

    public ResService(CategoriesService categoriesService){
        this.categoriesService = categoriesService;
    }

    public List<Categories> findAllCategories(){
        return categoriesService.getAllCategories();
    }


}
