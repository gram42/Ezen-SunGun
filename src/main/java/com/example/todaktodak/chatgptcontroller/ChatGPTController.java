package com.example.todaktodak.chatgptcontroller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;
import java.util.Optional;

@Controller // @RestController 대신 사용
public class ChatGPTController {
     
    @Value("${chatgpt.api.key}")
    private String chatGPTApiKey;

    @PostMapping("/chatgpt-api")
    public String getChatGPTResponse(@ModelAttribute ChatGPTDTO dto, Model model) {
             
        List<String> categories = Optional.ofNullable(dto.getInterest())
            .orElse(Collections.emptyList());

        // if (categories.isEmpty()) {
        //     model.addAttribute("error", "Invalid categories format");
        //     return "error"; // 에러 페이지 템플릿으로 이동
        // }

        String prompt = "I am interested in the following categories: " + String.join(", ", categories);
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(chatGPTApiKey);

        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("role", "user");
        messageMap.put("content", prompt);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        payload.put("messages", Collections.singletonList(messageMap));
        // payload.put("max_tokens", 50);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        
        ResponseEntity<ChatGPTResponse> response = restTemplate.postForEntity(
            apiUrl, 
            entity, 
            ChatGPTResponse.class
        );

        String answer = Optional.ofNullable(response.getBody())
            .map(ChatGPTResponse::getChoices)
            .filter(choices -> !choices.isEmpty())
            .map(choices -> choices.get(0))
            .map(Choice::getMessage)
            .map(Message::getContent)
            .orElse("No answer provided");

        // 모델에 데이터 추가
        model.addAttribute("response", answer);
        model.addAttribute("selectedCategories", categories);
        
        return "ui/result";
    }
}
