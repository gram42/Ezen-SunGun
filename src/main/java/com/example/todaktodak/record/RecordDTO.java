package com.example.todaktodak.record;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class RecordDTO {

    private RecordCompositeId compositeId;
    private String content;
    private Integer point = 0;
    private String userid;
    private Long categoryId;

    public RecordDTO(){}
    public RecordDTO(RecordCompositeId compositeId, String content, Integer point, String userid, Long categoryId) {
        this.compositeId = compositeId;
        this.content = content;
        this.point = point;
        this.userid = userid;
        this.categoryId = categoryId;
    }

    public RecordDTO(RecordCompositeId compositeId, String content, Integer point) {
        this.compositeId = compositeId;
        this.content = content;
        this.point = point;
    }

    public RecordDTO(RecordCompositeId compositeId) {
        this.compositeId = compositeId;
    }

    public RecordDTO(RecordCompositeId compositeId, Integer point) {
        this.compositeId = compositeId;
        this.point = point;
    }


    
}
