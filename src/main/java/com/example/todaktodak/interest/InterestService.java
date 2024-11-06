package com.example.todaktodak.interest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesDTO;
import com.example.todaktodak.category.CategoriesRepository;

@Service
public class InterestService {
    
    @Autowired
    private InterestRepository interestRepository;

    @Autowired 
    private CategoriesRepository categoriesRepository;

    public InterestService(InterestRepository interestRepository, CategoriesRepository categoriesRepository){
        this.interestRepository = interestRepository;
        this.categoriesRepository = categoriesRepository;
    }

    // 카테고리 리턴
    public List<Categories> getAllCategories(){
        return categoriesRepository.findAll();
    }

    // 유저 취향 리턴
    public List<CategoriesDTO> getUserInterests(String userid){

        List<Interest> interests = interestRepository.findByCompositeIdUserid(userid);
        List<CategoriesDTO> interestsId = new ArrayList<>();

        if(!interests.isEmpty()){
            for (Interest interest : interests) {
                Long categoryId = interest.getCompositeId().getCategoryId();
                interestsId.add(new CategoriesDTO(categoryId));
            }
        }
        return interestsId;
    }

    // 유저 취향 리턴(gpt 연결 버전)
    public List<String> getUserInterestsStr(String userid){

        List<Interest> interests = interestRepository.findByCompositeIdUserid(userid);
        List<String> interestsCategories = new ArrayList<>();

        if(!interests.isEmpty()){
            for (Interest interest : interests) {
                String categoryName = interest.getCategories().getName();
                interestsCategories.add(categoryName);
            }
        }

        return interestsCategories;

    }
        

    // 관심사 저장
    public void saveInterests(String userid, List<Long> interestDTO){

        // 기존 유저 관심사 지우기
        deleteUserInterests(userid);
        
        if (interestDTO != null) {
            // 새로 들어온 관심사 저장
            for (Long categoryId : interestDTO) {

                InterestCompositeId interestCompositeId = new InterestCompositeId(userid, categoryId);
                Interest interest = new Interest(interestCompositeId);

                interestRepository.save(interest);
            }
        } else {
        }
    }

    // 유저 관심사 삭제
    private void deleteUserInterests(String userid){

        List<Interest> interests = interestRepository.findByCompositeIdUserid(userid);

        if(!interests.isEmpty()){
            interestRepository.deleteAll(interests);
        }
    }
}
