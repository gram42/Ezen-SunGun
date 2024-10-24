package com.example.todaktodak.record;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    public static final int DAYS = 7;
    public static final int MONTHS = 12;

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

    // 일주일간 카테고리 당 포인트 데이터 연산 메소드 - 이 메소드 모르는게 좀 있음 공부하기
    public Map<String, List<Integer>> getPointsByDaysAndCategory(String userid) {

        List<Record> records = getRecordByDays(userid, DAYS);
    
        Map<String, List<Integer>> categoryPoints = new HashMap<>();
    
        for (Record record : records) {

            String categoryName = record.getCategory().getName();
            LocalDate recordedDate = record.getCompositeId().getRecordedDate();
    
            long daysDiff = ChronoUnit.DAYS.between(recordedDate, RecordController.TODAY);
            int dayIndex = DAYS - (int)daysDiff - 1;
    
            if (dayIndex >= 0 && dayIndex < DAYS) {
                int point = record.getPoint();

                // 카테고리별 배열 초기화 (0으로 채운 배열) - 이 부분 다시 공부
                // putIfAbsent - 만약 categoryName이 없으면 다음 내용추가
                // MONTHS 수만큼의 인덱스를 0으로 설정
                // 즉, categoryName이 없다면 categoryName을 키로 잡고 값은 MONTH개의 인덱스를(0 ~ 11) 값 0으로 할당
                categoryPoints.putIfAbsent(categoryName, new ArrayList<>(Collections.nCopies(DAYS, 0)));

                categoryPoints.get(categoryName).set(dayIndex, point);
            }
        }
    
        for (List<Integer> points : categoryPoints.values()) {
            for (int i = 0; i < DAYS; i++) {
                if (i > 0){
                    points.set(i, points.get(i) + points.get(i - 1));
                }
            }
        }
    
        return categoryPoints;
    }
    

    // 월간 카테고리 당 포인트 데이터 연산 메소드 - 이 메소드 모르는게 좀 있음 공부하기
    public Map<String, List<Integer>> getPointsByMonthsAndCategory(String userid){
        
        int currentMonth = LocalDate.now().getMonthValue();
        List<Record> records = getRecordByMonths(userid, MONTHS);
        Map<String, List<Integer>> categoryPoints = new HashMap<>();

        if (records == null || records.isEmpty()) {
            return categoryPoints;
        }

        for (Record record : records) {

        String categoryName = record.getCategory().getName();
        int recordedMonth = record.getCompositeId().getRecordedDate().getMonthValue();

        
        int monthIndex = (recordedMonth - currentMonth + MONTHS - 1) % MONTHS;
        
        if (monthIndex >= 0 && monthIndex < MONTHS) {
            int point = record.getPoint();
            
            // 카테고리별 배열 초기화 (0으로 채운 배열) - 이 부분 다시 공부
            // putIfAbsent - 만약 categoryName이 없으면 다음 내용추가
            // MONTHS 수만큼의 인덱스를 0으로 설정
            // 즉, categoryName이 없다면 categoryName을 키로 잡고 값은 MONTH개의 인덱스를(0 ~ 11) 값 0으로 할당
            categoryPoints.putIfAbsent(categoryName, new ArrayList<>(Collections.nCopies(MONTHS, 0)));
            

            // 월 포인트 누적 월마다 월 포인트만 전체 월 누적 아님
            int currentValue = categoryPoints.get(categoryName).get(monthIndex);
            categoryPoints.get(categoryName).set(monthIndex, currentValue + point);
        }
        }

        return categoryPoints;


    }

        // 주간 전체 포인트 데이터 연산 메소드
        public Integer getTotalPointsByDays(String userid) {


            List<Record> recordsByDays = getRecordByDays(userid, DAYS - 1);
        
            int totalPoint = 0;
        
            for (Record record : recordsByDays) {
                totalPoint += record.getPoint();
            }
        
            if (recordsByDays.isEmpty() || totalPoint == 0) {
                return null; // 또는 0을 반환할 수도 있음
            }
        
            return totalPoint;
        }

    // 오늘 기준 N주차 전까지 기록 찾는 메소드
    public List<Record> getRecordByDays(String userid, int days){

        LocalDate startDate = RecordController.TODAY.minusDays(days);
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
