package com.example.todaktodak.category;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class CategoriesService {

    private final CategoriesRepository categoriesRepository;

    public CategoriesService(CategoriesRepository categoriesRepository){
        this.categoriesRepository = categoriesRepository;
    }

    // 기본 카테고리 생성
    public void createDefaultCategory(){
        Categories categories = new Categories();
        categoriesRepository.save(categories);
    }
    
    // 모든 카테고리 찾기
    public List<Categories> getAllCategories(){

        List<Categories> foundCategory = categoriesRepository.findAll();
        if(foundCategory != null && !foundCategory.isEmpty()){

            return foundCategory;

        } else {

            return null;

        }
    }

    // 카테고리 이름 중복검사
    public boolean checkOverlap(CategoriesDTO categoriesDTO){
        String categoryName = categoriesDTO.getName();
        List<Categories> existNames = getAllCategories();

        for (Categories existName : existNames){
            if(existName.getName().equals(categoryName)){return true;}
        }
        return false;
        
    }

    // 카테고리 추가
    public void add(Categories categories){
        categoriesRepository.save(categories);
    }

    // 카테고리 수정
    public boolean edit(CategoriesDTO categoriesDTO){

        Categories editCategory = new Categories();

        Long id = categoriesDTO.getId();
        Optional<Categories> optionalCategory = categoriesRepository.findById(id);
        
        if (optionalCategory.isPresent()) {

            editCategory.setId(id);
            editCategory.setName(categoriesDTO.getName());

            categoriesRepository.save(editCategory);
            return true;
        } else {
            return false;
        }
    }

}
