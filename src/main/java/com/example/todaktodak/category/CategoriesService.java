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
    
    // 모든 카테고리 찾기
    public List<Categories> getAllCategories(){
        return categoriesRepository.findAll();
    }

    // 카테고리 추가
    public void add(Categories categories){
        categoriesRepository.save(categories);
    }

    // 카테고리 수정
    public boolean edit(CategoriesDTO categoriesDTO){

        Categories editCategory = new Categories();

        System.out.println(categoriesDTO);

        Long id = Long.parseLong(categoriesDTO.getStrId());
        System.out.println(id);
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
