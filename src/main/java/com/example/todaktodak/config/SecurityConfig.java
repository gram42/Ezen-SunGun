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

        httpSecurity.csrf(csrf -> csrf.disable()); // CSRF 비활성화

        httpSecurity.authorizeHttpRequests((authorize)-> authorize.requestMatchers("/**").permitAll());
        // .requestMatchers("/category").hasRole("ROLE-ADMIN") // 카테고리 수정 관리자만 접근 가능하게 하려면 이 코드 추가

        httpSecurity.formLogin((formLogin)->formLogin.loginPage("/user/login")
        .defaultSuccessUrl("/ui/main?login=true")
        .failureUrl("/user/login?error=true")
        .usernameParameter("userid")
        );

        httpSecurity.logout((logout)-> logout.logoutUrl("/user/logout").logoutSuccessUrl("/ui/index?logout=true"));

        return httpSecurity.build();
    }


}
