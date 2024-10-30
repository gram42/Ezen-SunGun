package com.example.todaktodak.record;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface RecordRepository extends JpaRepository<Record, RecordCompositeId>{
    
    // userid와 기록 날짜로 모든 기록 찾기
    List<Record> findByCompositeIdUseridAndCompositeIdRecordedDate(String userId, LocalDate date);
    
    // 외래키로 모든 데이터 찾기
    Optional<Record> findByCompositeId(RecordCompositeId compositeId);

    // 입력한 기간동안의 유저 기록 데이터 찾기
    List<Record> findByCompositeIdUseridAndCompositeIdRecordedDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    // userid의 모든 기록 찾기
    List<Record> findByCompositeIdUserid(String userid);


}
