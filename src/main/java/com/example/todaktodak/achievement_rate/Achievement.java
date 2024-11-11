package com.example.todaktodak.achievement_rate;

import java.time.LocalDate;

import com.example.todaktodak.category.Categories;
import com.example.todaktodak.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter
@ToString
public class Achievement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false, updatable = false)
    private User user; // 유저 아이디

    @ManyToOne
    @JoinColumn(name = "categoryId", referencedColumnName = "id", nullable = false)
    private Categories categories; // 카테고리 아이디

    @Column(nullable = false)
    LocalDate startDate; // 시작날짜

    @Column(nullable = false)
    LocalDate endDate; // 종료날짜

    String goal; // 목표

    public Achievement(){}
    public Achievement(User user, Categories categories, LocalDate starDate, LocalDate endDate, String goal){
        this.user = user;
        this.categories = categories;
        this.startDate = starDate;
        this.endDate = endDate;
        this.goal = goal;
    }

    public Achievement(Long id, User user, Categories categories, LocalDate starDate, LocalDate endDate, String goal){
        this.id = id;
        this.user = user;
        this.categories = categories;
        this.startDate = starDate;
        this.endDate = endDate;
        this.goal = goal;
    }

}
