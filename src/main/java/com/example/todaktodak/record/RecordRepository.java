package com.example.todaktodak.record;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface RecordRepository extends JpaRepository<Record, RecordCompositeId>{
    
    List<Record> findByCompositeIdUseridAndCompositeIdRecordedDate(String userId, LocalDate date);
    Optional<Record> findByCompositeId(RecordCompositeId compositeId);


}
