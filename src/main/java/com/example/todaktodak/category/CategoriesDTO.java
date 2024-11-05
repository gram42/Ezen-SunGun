package com.example.todaktodak.category;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class CategoriesDTO {
    Long id;
    String name;

    public CategoriesDTO(){}
    public CategoriesDTO(Long id){
        this.id = id;
    }
    public CategoriesDTO(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public CategoriesDTO(String name){
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CategoriesDTO)) return false;
        CategoriesDTO that = (CategoriesDTO) o;
        return Objects.equals(id, that.id); // ID로 비교
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // ID로 해시코드 생성
    }
}
