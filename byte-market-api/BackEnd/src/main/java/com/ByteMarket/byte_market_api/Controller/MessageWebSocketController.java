package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageWebSocketController {
    @Autowired
    private MessageService messageService;

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public MessageEntity sendMessage(MessageEntity message) {
        return messageService.addMessage(message);
    }
}
