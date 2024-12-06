package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import com.ByteMarket.byte_market_api.Repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;

    public ConversationEntity createConversation(int senderId, int receiverId) {
        ConversationEntity conversation = new ConversationEntity(senderId, receiverId, Instant.now());
        return conversationRepository.save(conversation);
    }

    public List<ConversationEntity> getAllConversations() {
        return conversationRepository.findAll();
    }

    public ConversationEntity getConversationBySenderAndReceiver(int senderId, int receiverId) {
        return conversationRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }

    public List<ConversationEntity> getAllConversationsByUserId(int userId) {
        return conversationRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public ConversationEntity updateConversation(int id, int senderId, int receiverId) {
        ConversationEntity conversation = conversationRepository.findById(id).orElse(null);
        if (conversation == null) {
            return null;
        }
        conversation.setSenderId(senderId);
        conversation.setReceiverId(receiverId);
        return conversationRepository.save(conversation);
    }

    public void deleteConversation(int id) {
        conversationRepository.deleteById(id);
    }
}