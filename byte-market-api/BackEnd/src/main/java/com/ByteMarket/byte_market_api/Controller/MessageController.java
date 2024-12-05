package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Service.MessageService;
import com.azure.core.annotation.Get;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/addMessage")
    public MessageEntity addMessage(@RequestBody MessageEntity message) {
        System.out.println(message.getReceiverId());
        return messageService.addMessage(message);
    }
    @GetMapping("/getAllConversation")
    public List<MessageEntity> getAllConversation(@RequestParam(required = false) Integer senderId, @RequestParam(required = false) Integer receiverId) {
        return messageService.getAllConversation(senderId, receiverId);
    }
    @GetMapping("/getNewMessages")
    public List<MessageEntity> getNewMessages(@RequestParam int receiverId, @RequestParam int senderId, @RequestParam Instant lastTimestamp) {
        return messageService.getNewMessages(receiverId, senderId, lastTimestamp);
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
    public MessageEntity updateMessage(@PathVariable int id, @RequestBody MessageEntity message) {
        return messageService.updateMessage(id, message);
    }
}
