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
        // httpSecurity.csrf(csrf -> csrf
        //     .ignoringRequestMatchers("/user/login", "/user/login?error=true", "/user/logout", "/chatgpt-api") // 로그인 페이지, 로그인 실패, 로그아웃에 대해서만 CSRF 비활성화
        // );

        // 인증 필요 설정
        httpSecurity.authorizeHttpRequests((authorize) -> 
            authorize
                .requestMatchers("/community/writing").authenticated() // /community/writing 경로는 인증 필요
                .requestMatchers("/categories").hasRole("ADMIN") // 카테고리 수정, 관리자만 접근 가능
                .anyRequest().permitAll() // 그 외 요청은 모두 허용
        );

        // 세션 관리
        // httpSecurity.sessionManagement(session -> 
        //     session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 필요한 경우에만 세션 생성
        // );

        // 로그인 설정
       httpSecurity.formLogin(formLogin -> 
            formLogin
                .loginPage("/user/login")
                .defaultSuccessUrl("/ui/main?login=true") // 로그인 성공 후 이동할 URL
                .failureUrl("/user/login?error=true") // 로그인 실패 시 이동할 URL
                .usernameParameter("userid") // 사용자 이름 매개변수 설정
        );

        // 로그아웃 설정
        httpSecurity.logout(logout -> 
            logout
                .logoutUrl("/user/logout") // 로그아웃 URL
                .logoutSuccessUrl("/ui/index?logout=true") // 로그아웃 성공 후 이동할 URL
        );

        return httpSecurity.build();
    }
}

