package com.example.todaktodak.record;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// 복합키 (날짜별 카테고리당 1개만 기록 가능)
@Embeddable
@Getter @Setter
@ToString
public class RecordCompositeId implements Serializable {

    private String userid;          // 사용자 ID (String)
    private Long categoryId;        // 카테고리 ID (Long)
    private LocalDate recordedDate; // 기록 날짜

    public RecordCompositeId(){}
    public RecordCompositeId(String userid, Long categoryId, LocalDate recordedDate){

        this.userid = userid;
        this.categoryId = categoryId;
        this.recordedDate = recordedDate;

    }
    public RecordCompositeId(String userid, LocalDate recordedDate) {

        this.userid = userid;
        this.recordedDate = recordedDate;

    }

    // 데이터의 유일성을 위해 equals 오버라이드
    @Override
    public boolean equals(Object o) { // 자바는 객체 비교를 위해 Object의 equals 메소드를 사용
        if (this == o) return true;
        if (!(o instanceof RecordCompositeId)) return false;
        
        RecordCompositeId that = (RecordCompositeId) o;
        return Objects.equals(userid, that.userid) &&
               Objects.equals(categoryId, that.categoryId) &&
               Objects.equals(recordedDate, that.recordedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userid, categoryId, recordedDate);
    }



}
