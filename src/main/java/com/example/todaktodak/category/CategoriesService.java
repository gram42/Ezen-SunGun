package com.example.todaktodak.category;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    public CategoriesService(CategoriesRepository categoriesRepository){
        this.categoriesRepository = categoriesRepository;
    }
    
    public List<Categories> getAllCategories(){
        return categoriesRepository.findAll();
    }

}
