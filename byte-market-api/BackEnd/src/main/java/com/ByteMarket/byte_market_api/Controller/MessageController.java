package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/addMessage")
    public MessageEntity addMessage(MessageEntity message) {
        return messageService.addMessage(message);
    }

    @GetMapping("/getMessageById/{id}")
    public MessageEntity getMessageById(int id) {
        return messageService.getMessageById(id);
    }

    @GetMapping("/getAllMessages")
    public List<MessageEntity> getAllMessages() {
        return messageService.getAllMessages();
    }

    @PutMapping("/updateMessage/{id}")
    public MessageEntity updateMessage(@PathVariable int id, @RequestBody MessageEntity newMessage) {
        return messageService.updateMessage(id, newMessage);
    }
    @DeleteMapping("/deleteMessage/{id}")
    public void deleteMessage(@PathVariable int id) {
        messageService.deleteMessage(id);
    }
}
