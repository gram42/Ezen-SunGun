package com.example.todaktodak.category;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class CategoriesDTO {
    Long id;
    String name;
    String strId;
    public CategoriesDTO(){}
    public CategoriesDTO(Long id, String name){
        this.id = id;
        this.name = name;
    }
    public CategoriesDTO(String strId, String name){
        this.strId = strId;
        this.name = name;
    }
    public CategoriesDTO(String name){
        this.name = name;
    }
}
