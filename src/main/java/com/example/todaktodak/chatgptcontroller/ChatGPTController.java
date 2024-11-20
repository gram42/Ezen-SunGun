package com.example.todaktodak.chatgptcontroller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Controller
public class ChatGPTController {


    @Value("${chatgpt.api.key}")
    private String chatGPTApiKey;

    @PostMapping("/chatgpt-api")
    public String getChatGPTResponse(@ModelAttribute ChatGPTDTO dto, Model model) {
        
        List<String> categories = Optional.ofNullable(dto.getInterest()).orElse(Collections.emptyList());

        if (categories.isEmpty()) {
            model.addAttribute("error", "Invalid categories format");
            return "error";
        }

        String apiUrl = "https://api.openai.com/v1/chat/completions";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(chatGPTApiKey);
        
        List<Map<String, String>> allCategoryResults = new ArrayList<>();
        
        // 각 카테고리에 대해 순차적으로 처리
        for (String category : categories) {
            // 프롬프트 설정 (하나의 카테고리만 포함)
            String prompt = "한국인 상담사이며 제안자입니다. 한국어만 사용하며, 제시된 주제에 맞춰 3가지를 추천해 주세요. 추천 대상은 이름과 간략한 설명만으로 응답합니다." +
                            "각 주제는 개별적으로 나누어 응답해 주세요." +
                            "질문을 하는 사람은 각 분야를 처햣 음으로 접하는 사람입니다. 처음으로 접하기 때문에 생소해 합니다." +
                            "질문자에 맞춰서 간단하게 시작할 수 있는 대상과 내용으로 추천해야 합니다." +
                            "처음 시작할 때 5분에서 10분 정도로 실행할 수 있는 내용으로 추천합니다." +
                            "추천 내용은 구체적으로 실행할 수 있도록 구체적인 내용으로 제시하세요." +
                            "사람이 말하듯이 구어체의 친절한 어조로 응답하세요." +
                            "응답 내용은 300글자 숫자 이내로 하세요." +
                             
                            "응답 형식은 다음과 같습니다.\n\n" +
                            category +
                            "1. 이름1: 설명1\n\n" +
                            "2. 이름2: 설명2\n\n" +
                            "3. 이름3: 설명3\n\n" +

                            "주제 하나에 하나의 응답만 작성하세요." +
                            "절대 주제 이름을 포함하지 마세요. 추천 목록만 출력하세요." +
                            "모든 응답은 주제 이름을 반복하지 않고 오직 해당 추천 리스트만 작성하는 방식으로 하며, 주제 이름은 어떤 경우에도 포함하지 않도록 하세요."+
                            "각 항목은 지정된 형식만으로 작성하고, 다른 정보나 주제는 절대로 추가하지 마세요." +
                            "어떤 경우라도 반드시 제시된 주제만으로 응답을 해야 합니다. 제시된 주제 외에는 응답은 오류이니 출력하지 마세요 " +
                            "주제를 중복하거나 불필요한 기호(### 등)를 추가하지 마세요." +
                            "답변 예시인 이름1: 설명1의 형태는 답변을 출력할 때 참조하는 예시일 뿐입니다. 답변에 직접적으로 사용해서 출력하지 마세요." +
                            "답변은 지정된 형식만으로 이루어져야 합니다.\n\n";

            // API 요청 준비
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("role", "user");
            messageMap.put("content", prompt);

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "gpt-4o-mini");
            payload.put("messages", Collections.singletonList(messageMap));

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            try {
                // API 호출
                ResponseEntity<Map> responseEntity = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, Map.class);
                Map<String, Object> responseBody = responseEntity.getBody();

                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                String answer = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
  
                // \n을 <br>로 변환하여 여러 줄로 표시되도록 함
                String formattedAnswer = answer.replace("\n", "<br>");
                
                // 카테고리 결과를 저장
                Map<String, String> categoryResult = new HashMap<>();
                categoryResult.put("name", category);
                categoryResult.put("content", formattedAnswer);
                allCategoryResults.add(categoryResult);

            } catch (Exception e) {
                e.printStackTrace();
                model.addAttribute("error", "Error occurred: " + e.getMessage());
                return "error";
            }
        }

        // 모든 카테고리 결과를 모델에 추가
        model.addAttribute("categories", allCategoryResults);
        return "ui/result";
    }

    @GetMapping("/result")
    public String showResult(Model model) {
        return "ui/result";
    }
}