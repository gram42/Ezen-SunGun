package com.example.todaktodak.interest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InterestRepository extends JpaRepository<Interest, InterestCompositeId> {
    
    List<Interest> findByCompositeIdUserid(String userid); // 유저 아이디로 관심사 찾기

}
