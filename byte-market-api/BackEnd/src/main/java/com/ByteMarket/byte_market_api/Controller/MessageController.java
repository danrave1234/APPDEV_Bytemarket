package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Service.ConversationService;
import com.ByteMarket.byte_market_api.Service.MessageService;
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
    @Autowired
    private ConversationService conversationService;

    @PostMapping("/addMessage")
    public MessageEntity addMessage(@RequestBody MessageEntity message) {
        int senderId = message.getSenderId();
        int receiverId = message.getReceiverId();

        // Check if a conversation already exists
        ConversationEntity conversation = conversationService.getConversationBySenderAndReceiver(senderId, receiverId);
        if (conversation == null) {
            conversation = conversationService.getConversationBySenderAndReceiver(receiverId, senderId);
            if (conversation == null) {
                conversation = conversationService.createConversation(senderId, receiverId);
            }
        }
        // Set the conversation for the message
        message.setConversation(conversation);
        conversation.setRead(false);
        conversation.setLastMessage(message.getMessage().substring(0, Math.min(6, message.getMessage().length())));
        return messageService.addMessage(message);
    }

    @GetMapping("/getConversation")
    public List<MessageEntity> getAllConversation(@RequestParam int conversationId) {
        return messageService.getAllConversation(conversationId);
    }

    @GetMapping("/getNewMessages")
    public List<MessageEntity> getNewMessages(@RequestParam int conversationId, @RequestParam Instant lastTimestamp) {
        return messageService.getNewMessages(conversationId, lastTimestamp);
    }

    @GetMapping("/getMessageById/{id}")
    public MessageEntity getMessageById(@PathVariable int id) {
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

    @DeleteMapping("/deleteMessage/{id}")
    public void deleteMessage(@PathVariable int id) {
        messageService.deleteMessage(id);
    }
}