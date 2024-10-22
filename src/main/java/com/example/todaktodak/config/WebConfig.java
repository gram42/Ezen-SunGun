package com.example.todaktodak.config;

import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


public class WebConfig implements WebMvcConfigurer{
    
    @Override
public void addCorsMappings(@NonNull CorsRegistry registry) {
    registry.addMapping("/**")
    .allowedOrigins("http://localhost:9090")  // 클라이언트 도메인 확인
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true);
}

}

