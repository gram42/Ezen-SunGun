package com.example.todaktodak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // CSRF 비활성화
        httpSecurity.csrf(csrf -> csrf.disable());

        // 인증 필요 설정
        httpSecurity.authorizeHttpRequests((authorize) -> 
    authorize
        .requestMatchers("/user/login", "/user/register").permitAll() // 로그인, 회원가입은 인증 필요 없음
        .requestMatchers("/user/**").authenticated() // 그 외 /user/**는 인증 필요
        .requestMatchers("/community/writing").authenticated() // /community/writing 경로는 인증 필요
        .requestMatchers("/posts/**").permitAll() // /posts/**는 인증 없이 접근 가능
        .anyRequest().permitAll() // 그 외 요청은 모두 허용
        // .requestMatchers("/category").hasRole("ADMIN") // 카테고리 수정 관리자만 접근 가능하게 하려면 이 코드 추가
);


        // 로그인 설정
        httpSecurity.formLogin((formLogin) -> formLogin
            .loginPage("/user/login")
            .defaultSuccessUrl("/ui/main?login=true")
            .failureUrl("/user/login?error=true")
            .usernameParameter("userid")
        );

        // 로그아웃 설정
        httpSecurity.logout((logout) -> 
            logout.logoutUrl("/user/logout")
                  .logoutSuccessUrl("/ui/index?logout=true")
        );

        return httpSecurity.build();
    }
}

