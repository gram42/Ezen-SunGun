package com.example.todaktodak.record;



import com.example.todaktodak.category.Categories;
import com.example.todaktodak.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter
@ToString
public class Record {

    @EmbeddedId
    private RecordCompositeId compositeId; // 복합키(PK)

    // 외래키 설정
    @ManyToOne // 여러 기록이 하나의 유저에 속함
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false, insertable = false, updatable = false) // userid의 경우 기본 키가 아니기 때문에 업데이트가 안되게끔 만들어서 복합키와 연결
    private User user;

    @ManyToOne // 여러 기록이 하나의 카테고리에 속함
    @MapsId("categoryId") // RecordCompositeId의 categoryId와 연결
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private Categories category;
    
    @Column(length = 500)
    private String content; // 본문 500자 제한
    
    @Column(nullable = false)
    private Integer point = 0; // 달성 포인트
    

    public Record(){}

    public Record(RecordCompositeId compositeId, String content, Integer point) {
        this.compositeId = compositeId;
        this.content = content;
        this.point = point;
    }

    public Record(RecordCompositeId compositeId, String content, Integer point, User user, Categories category) {
        this.compositeId = compositeId;
        this.content = content;
        this.point = point;
        this.user = user;
        this.category = category;
    }

    

}
