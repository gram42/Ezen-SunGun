package com.example.todaktodak.category;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter
@ToString
public class Categories {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK ID

    @Column(nullable = false, length = 20, unique = true)
    private String name; // 카테고리 이름

    public Categories(){}

    public Categories(String name){

        this.name = name;

    }

    public Categories(Long id, String name){
        this.id = id;
        this.name = name;
    }


}
