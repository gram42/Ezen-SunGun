package com.example.todaktodak.interest;


import com.example.todaktodak.category.Categories;
import com.example.todaktodak.user.User;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter
@ToString
public class Interest {

    @EmbeddedId
    private InterestCompositeId compositeId; // 복합키(PK)

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false, insertable = false, updatable = false) // userid의 경우 기본 키가 아니기 때문에 업데이트가 안되게끔 만들어서 복합키와 연결
    private User user;

    @ManyToOne
    @JoinColumn(name = "categoryId", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private Categories categories;

    public Interest(){}
    public Interest(InterestCompositeId compositeId){
        this.compositeId = compositeId;
    }
    
}
