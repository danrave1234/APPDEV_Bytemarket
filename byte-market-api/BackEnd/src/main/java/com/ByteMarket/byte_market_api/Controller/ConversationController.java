package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import com.ByteMarket.byte_market_api.Entity.UserEntity;
import com.ByteMarket.byte_market_api.Service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/conversation")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @PutMapping("/setConversationRead/{conversationId}")
    public void setConversationRead(@PathVariable int conversationId) {
        conversationService.setConversationRead(conversationId);
    }

    @PostMapping("/addConversation")
    public ConversationEntity createConversation(@RequestParam int senderId, @RequestParam int receiverId) {
        return conversationService.createConversation(senderId, receiverId);
    }

    @PostMapping("/updateLastMessage")
    public void updateLastMessage(@RequestBody Map<String, Object> payload) {
        int conversationId = (int) payload.get("conversationId");
        String lastMessage = (String) payload.get("lastMessage");
        conversationService.updateLastMessage(conversationId, lastMessage);
    }

    @GetMapping("/getConversationBySenderAndReceiver/{senderId}/{receiverId}")
    public ConversationEntity getConversationBySenderAndReceiver(@PathVariable int senderId, @PathVariable int receiverId) {
        return conversationService.getConversationBySenderAndReceiver(senderId, receiverId);
    }

    @GetMapping("/getAllConversationsByUserId")
    public List<ConversationEntity> getAllConversationsByUserId(@RequestParam int userId) {
        return conversationService.getAllConversationsByUserId(userId);
    }

    @GetMapping("/getAllConversations")
    public List<ConversationEntity> getAllConversations() {
        return conversationService.getAllConversations();
    }

    @PutMapping("/updateConversation/{id}")
    public ConversationEntity updateConversation(@PathVariable int id, @RequestParam int senderId, @RequestParam int receiverId) {
        return conversationService.updateConversation(id, senderId, receiverId);
    }

    @DeleteMapping("/deleteConversation/{id}")
    public void deleteConversation(@PathVariable int id) {
        conversationService.deleteConversation(id);
    }
}