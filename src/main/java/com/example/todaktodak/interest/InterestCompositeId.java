package com.example.todaktodak.interest;

import java.util.Objects;


import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Embeddable
@Getter @Setter
@ToString
public class InterestCompositeId {

    String userid;
    Long categoryId;

    public InterestCompositeId(){}

    public InterestCompositeId(String userid){
        this.userid = userid;
    }

    public InterestCompositeId(String userid, Long categoryId){
        this.userid = userid;
        this.categoryId = categoryId;
    }

    // 데이터의 유일성을 위해 equals 오버라이드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InterestCompositeId)) return false;
        
        InterestCompositeId that = (InterestCompositeId) o;
        return Objects.equals(userid, that.userid) &&
               Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userid, categoryId);
    }


}
