package com.example.todaktodak.achievement_rate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesRepository;
import com.example.todaktodak.record.RecordRepository;
import com.example.todaktodak.user.User;
import com.example.todaktodak.user.UserRepository;
import com.example.todaktodak.record.Record;


@Service
public class AchievementService {
    @Autowired
    private final AchievementRepository achievementRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final CategoriesRepository categoriesRepository;
    @Autowired
    private final RecordRepository recordRepository;
    
    public AchievementService(AchievementRepository achievementRepository, 
                                UserRepository userRepository, 
                                CategoriesRepository categoriesRepository,
                                RecordRepository recordRepository
                                ){
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
        this.categoriesRepository = categoriesRepository;
        this.recordRepository = recordRepository;
    }

    // 목표하는 달성률 정보 저장
    public void saveAchievementGoal(String userid, AchievementDTO achievementDTO){
        Achievement goal = new Achievement();

        Optional<User> optionalUser = userRepository.findByUserid(userid);
        Optional<Categories> optionalCategory = categoriesRepository.findById(achievementDTO.getCategoryId());

        if (optionalUser.isPresent() && optionalCategory.isPresent()){

            User user = optionalUser.get();
            Categories categories = optionalCategory.get();

            goal.setUser(user);
            goal.setCategories(categories);
            goal.setStartDate(achievementDTO.getStartDate());
            goal.setEndDate(achievementDTO.getEndDate());
            goal.setGoal(achievementDTO.getGoal());
            
            achievementRepository.save(goal);
        }
    }

    // 모든 카테고리 리턴
    public List<Categories> getAllCategories(){
        return categoriesRepository.findAll();
    }

    // 유저의 목표 달성률 목록 리턴
    public List<Achievement> getAllGoalsByUser(String userid){
        return achievementRepository.findByUser(userRepository.findByUserid(userid).get());
    }

    

    // 유저 목표 기간에 해당하는 포인트 데이터(현재 점수-진행률) 리턴
    public List<AchievementDTO> getTotalUserInfo(String userid){
        AchievementDTO achievementDTO = new AchievementDTO();

        List<AchievementDTO> achievementDTOs = new ArrayList<>();

        List<Achievement> achievements = getAllGoalsByUser(userid);
        
        for (Achievement achievement : achievements) {


            // 목표기간 전체 포인트 점수 계산
            LocalDate startDate = achievement.getStartDate();
            LocalDate endDate = achievement.getEndDate();
            Integer wholePoint = (int) startDate.until(endDate, ChronoUnit.DAYS);

            // 목표기간 현재 포인트 점수 계산
            List<Record> recordList =  recordRepository.findByCompositeIdUseridAndCompositeIdCategoryIdAndCompositeIdRecordedDateBetween(
                                                                                                                        userid, 
                                                                                                                        achievement.getCategories().getId(), 
                                                                                                                        startDate, 
                                                                                                                        endDate);
            Integer currPoint = 0;
            for (Record record : recordList) {
                currPoint = currPoint + record.getPoint();

            }

            achievementDTO = new AchievementDTO(achievement, wholePoint, currPoint);
            achievementDTOs.add(achievementDTO);

        }
        return achievementDTOs;
    }

    

}
