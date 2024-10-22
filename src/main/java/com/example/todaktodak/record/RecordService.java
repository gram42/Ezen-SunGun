package com.example.todaktodak.record;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
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

    public static final int WEEKS = 5;
    public static final int MONTHS = 6;

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


    // 주간 카테고리 당 포인트 데이터 연산 메소드(주간 포인트 모두 합산)
    public Map<String, Integer> getPointsByWeeksAndCategory(String userid){


        List<Record> recordsByWeeks = getRecordByWeeks(userid, WEEKS);

        Map<String, Integer> categoryPoints = new HashMap<>();

        for (Record record : recordsByWeeks) {

            String categoryName = record.getCategory().getName();
            int point = record.getPoint();

            if (categoryPoints.containsKey(categoryName)){
                categoryPoints.put(categoryName, categoryPoints.get(categoryName) + point);
            } else {
                categoryPoints.put(categoryName, point);
            }
        }

        return categoryPoints;
    }

    // 주차별 전체 포인트 데이터 연산 메소드
    public Integer getTotalPointsByWeeks(String userid) {


        List<Record> recordsByWeeks = getRecordByWeeks(userid, WEEKS);
    
        int totalPoint = 0;
    
        for (Record record : recordsByWeeks) {
            totalPoint += record.getPoint();
        }
    
        if (recordsByWeeks.isEmpty() || totalPoint == 0) {
            return null; // 또는 0을 반환할 수도 있음
        }
    
        return totalPoint;
    }

    // 월간 카테고리 당 포인트 데이터 연산 메소드(월별 누적합산)
    public Map<String, List<Integer>> getPointsByMonthsAndCategory(String userid){
        
        List<Record> records = getRecordByMonths(userid, MONTHS);

        Map<String, List<Integer>> categoryPoints = new HashMap<>();
        
        for (Record record : records) {

            String categoryName = record.getCategory().getName();
            int monthIndex = LocalDate.now().getMonthValue() - record.getCompositeId().getRecordedDate().getMonthValue();

            if (monthIndex >= 0 && monthIndex < MONTHS) {
                int point = record.getPoint();

                // 카테고리별 배열 초기화 (0으로 채운 배열) - 이 부분 다시 공부
                categoryPoints.putIfAbsent(categoryName, new ArrayList<>(Collections.nCopies(MONTHS, 0)));

                // 해당 월의 포인트를 누적
                int currentValue = categoryPoints.get(categoryName).get(monthIndex);
                categoryPoints.get(categoryName).set(monthIndex, currentValue + point);
            }
        }

        return categoryPoints;
    }

    // 오늘 기준 N주차 전까지 기록 찾는 메소드
    public List<Record> getRecordByWeeks(String userid, int weeks){

        LocalDate startDate = RecordController.TODAY.minusWeeks(weeks);
        LocalDate endDate = RecordController.TODAY;

        return recordRepository.findByCompositeIdUseridAndCompositeIdRecordedDateBetween(userid, startDate, endDate);

    }

    // 오늘 기준 N개월 전까지 기록 찾는 메소드
    public List<Record> getRecordByMonths(String userid, int months){

        LocalDate startDate = RecordController.TODAY.minusMonths(months).withDayOfMonth(1);
        LocalDate endDate = RecordController.TODAY;

        return recordRepository.findByCompositeIdUseridAndCompositeIdRecordedDateBetween(userid, startDate, endDate);

    }




    


}
