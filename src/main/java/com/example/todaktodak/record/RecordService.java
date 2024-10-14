package com.example.todaktodak.record;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.category.CategoriesService;
import com.example.todaktodak.user.User;
import com.example.todaktodak.user.UserService;

@Service
public class RecordService {

    @Autowired
    private final RecordRepository recordRepository;
    @Autowired
    private final CategoriesService categoriesService;
    @Autowired
    private final UserService userService;


    public RecordService(RecordRepository recordRepository, CategoriesService categoriesService, UserService userService){
        this.recordRepository = recordRepository;
        this.categoriesService = categoriesService;
        this.userService = userService;
    }

    // 날짜에 맞는 기록 리턴
    public List<Record> getUserRecordByUseridAndRecordedDate(String userid, LocalDate recordedDate){

        List<Record> userRecords = recordRepository.findByCompositeIdUseridAndCompositeIdRecordedDate(userid, recordedDate);
        
        if (!userRecords.isEmpty()){
            return userRecords;
        } 
        else{

            createNewRecord(userid, recordedDate);
            return recordRepository.findByCompositeIdUseridAndCompositeIdRecordedDate(userid, recordedDate);
            
        }

    }


    // 기록이 없을 시 기본 정보 생성
    public void createNewRecord(String userId, LocalDate localDate){
        
        Record record;
        List<Categories> categories = categoriesService.getAllCategories();
        User user = userService.getUserByUserid(userId);

        for (Categories category : categories) {
            
            RecordCompositeId recordCompositeId = new RecordCompositeId(userId, category.getId(), localDate);
            record = new Record(recordCompositeId, "", 0, user, category);

            recordRepository.save(record);
        }
    }

    // 복합키를 활용해 포인트 저장
    public void setPoint(RecordCompositeId compositeId, Integer point){
        Optional<Record> optionalRecord  = recordRepository.findByCompositeId(compositeId);

        if (optionalRecord.isPresent()){

            Record record = optionalRecord.get();
            record.setPoint(point);
            recordRepository.save(record);

        }
        else{
            System.out.println("유저 찾기 실패");
            System.out.println("ID : " + compositeId.getUserid() + " " + 
                               "categoryId : " + compositeId.getCategoryId() + " " +
                               "date : " + compositeId.getRecordedDate());
        }

    }

    // 포인트와 같은 방식으로 본문 저장
    public void setContent(RecordCompositeId compositeId, String content){
        
        Optional<Record> optionalRecord  = recordRepository.findByCompositeId(compositeId);

        if (optionalRecord.isPresent()){

            Record record = optionalRecord.get();
            record.setContent(content);
            recordRepository.save(record);

        }
        else{
            System.out.println("유저 찾기 실패");
            System.out.println("ID : " + compositeId.getUserid() + " " + "categoryId : " + compositeId.getCategoryId() + " " + "date : " + compositeId.getRecordedDate());
        }

    }


    // 기간별 카테고리 당 포인트데이터 연산 메소드 - 가져온 데이터에서 포인트만 뽑아서 더해야함, 리턴 값은 카테고리 정보(id, 이름)와 카테고리별 포인트 합산 결과
    public Map<String, Integer> getTotalPointsByMonth(String userid){ // 리턴 값 생각 할 것

        int weeks = 5;
        List<Record> weeksRecords = getRecordNWeeks(userid, weeks);

        Map<String, Integer> categoryPoints = new HashMap<>();
        categoryPoints.put("전체", 0);

        for (Record record : weeksRecords) {

            String categoryName = record.getCategory().getName();
            int point = record.getPoint();

            if (categoryPoints.containsKey(categoryName)){
                categoryPoints.put(categoryName, categoryPoints.get(categoryName) + point);
            } else {
                categoryPoints.put(categoryName, point);
            }

            categoryPoints.put("전체", categoryPoints.get("전체") + point);

        }

        return categoryPoints;
    }

    
    // 오늘 기준 N주차 전까지 기록 찾는 메소드
    public List<Record> getRecordNWeeks(String userid, Integer N){

        LocalDate startDate = RecordController.TODAY.minusWeeks(N);
        LocalDate endDate = RecordController.TODAY;

        return recordRepository.findByCompositeIdUseridAndCompositeIdRecordedDateBetween(userid, startDate, endDate);

    }


    


}
