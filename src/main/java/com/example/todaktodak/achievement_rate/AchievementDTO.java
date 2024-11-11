package com.example.todaktodak.achievement_rate;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class AchievementDTO {

    Long id;
    String userid;
    Long categoryId;
    String categoryName;
    LocalDate startDate;
    LocalDate endDate;
    String goal;
    Integer totalPoint;
    Integer currPoint;

    public AchievementDTO(){}
    
    public AchievementDTO(
                            String userid,
                            Long categoryId,
                            String categoryName,
                            LocalDate startDate,
                            LocalDate endDate,
                            String goal,
                            Integer totalPoint,
                            Integer currPoint
                            )
                            {
        this.userid = userid;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.goal = goal;
        this.totalPoint = totalPoint;
        this.currPoint = currPoint;
    }

    public AchievementDTO(  Long id, 
                            String userid,
                            String categoryName,
                            Long categoryId,
                            LocalDate startDate,
                            LocalDate endDate,
                            String goal,
                            Integer totalPoint,
                            Integer currPoint
                            )
                            {
        this.id = id;
        this.userid = userid;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.goal = goal;
        this.totalPoint = totalPoint;
        this.currPoint = currPoint;
    }

    public AchievementDTO(  
                            Achievement achievement,
                            Integer totalPoint,
                            Integer currPoint
                            )
                            {

        this.id = achievement.getId();
        this.userid = achievement.getUser().getUserid();
        this.categoryId = achievement.getCategories().getId();
        this.categoryName = achievement.getCategories().getName();
        this.startDate = achievement.getStartDate();
        this.endDate = achievement.getEndDate();
        this.goal = achievement.getGoal();
        this.totalPoint = totalPoint;
        this.currPoint = currPoint;
    }


    }
