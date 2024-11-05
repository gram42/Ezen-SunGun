package com.example.todaktodak.exception;

// 사용자 정의 예외 클래스
public class NoResourceFoundException extends RuntimeException {
    public NoResourceFoundException(String message) {
        super(message);
    }

    public NoResourceFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
