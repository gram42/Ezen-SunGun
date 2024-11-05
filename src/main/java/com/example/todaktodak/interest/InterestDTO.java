package com.example.todaktodak.interest;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InterestDTO {
    private InterestCompositeId interestCompositeId;
    private List<Long> categories;

    public InterestDTO(){}
    public InterestDTO(InterestCompositeId interestCompositeId){
        this.interestCompositeId = interestCompositeId;
    }
    public InterestDTO(List<Long> categories){
        this.categories = categories;
    }

}
