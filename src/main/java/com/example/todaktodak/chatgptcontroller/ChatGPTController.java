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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Controller
public class ChatGPTController {
    
    @Value("${chatgpt.api.key}")
    private String chatGPTApiKey;

    @PostMapping("/chatgpt-api")
    public String getChatGPTResponse(@ModelAttribute ChatGPTDTO dto, Model model) {
             
        List<String> categories = Optional.ofNullable(dto.getInterest())
            .orElse(Collections.emptyList());

        if (categories.isEmpty()) {
            model.addAttribute("error", "Invalid categories format");
            return "error";
        }

        String prompt = "나는 한국인 상담사이며 제안자입니다. 한국어만 사용합니다. 제시되는 주제별로 각각 3가지를 찾아서 추천합니다. 추천하는 대상은 이름, 간략한 설명만 응답합니다. 각 주제에 대해 답변할 때는 새 줄로 구분해 주세요. 예시 형식:\n\n" +
        "질문: 등산\n" +
        "답변:\n" +
        "1. 지리산 : 남부 지방의 명산으로 여름에 놀러가기 좋다.\n" +
        "2. 설악산 : 가을 단풍으로 유명하다.\n" +
        "3. 북한산 : 서울 근교에서 접근이 쉽다.\n\n" +
        "이 형식으로, 주제별로 각 줄을 새롭게 시작하여 응답해 주세요. 다음 주제는 새 문단에서 시작합니다. : " + String.join(", ", categories);

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

        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        String[] answerParts = answer.split("질문:");

        for (String part : answerParts) {
            if (!part.trim().isEmpty()) {
                String[] lines = part.trim().split("\n");
                if (lines.length > 1) {
                    String question = lines[0].trim();
                    List<Answer> answers = new ArrayList<>();
                    for (int i = 1; i < lines.length; i++) {
                        String answerText = lines[i].trim();
                        String[] answerDetails = answerText.split(" : ");
                        if (answerDetails.length == 2) {
                            answers.add(new Answer(answerDetails[0], "", answerDetails[1]));  // 제목을 name에
                        }
                    }
                    questionAnswers.add(new QuestionAnswer(question, answers));
                }
            }
        }

        model.addAttribute("response", questionAnswers);
        model.addAttribute("selectedCategories", categories);
        
        return "ui/result";
    }
    
    public static class QuestionAnswer {
        private String question;
        private List<Answer> answers;

        public QuestionAnswer(String question, List<Answer> answers) {
            this.question = question;
            this.answers = answers;
        }

        public String getQuestion() {
            return question;
        }

        public List<Answer> getAnswers() {
            return answers;
        }
    }

    public static class Answer {
        private String name;  // 제목 추가
        private String image;
        private String description;

        public Answer(String name, String image, String description) {
            this.name = name;
            this.image = image;
            this.description = description;
        }

        public String getName() {
            return name;
        }

        public String getImage() {
            return image;
        }

        public String getDescription() {
            return description;
        }
    }
}
