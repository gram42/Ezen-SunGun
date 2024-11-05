package com.example.todaktodak.chatgptcontroller;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatGPTResponse {
    private List<Choice> choices;
}

@Getter
@Setter
@ToString
class Choice {
    private Message message;
}

@Getter
@Setter
@ToString
class Message {
    private String content;
}