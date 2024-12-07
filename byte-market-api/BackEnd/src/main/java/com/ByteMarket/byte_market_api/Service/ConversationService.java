package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import com.ByteMarket.byte_market_api.Entity.UserEntity;
import com.ByteMarket.byte_market_api.Repository.ConversationRepository;
import com.ByteMarket.byte_market_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private UserRepository userRepository;

    public ConversationEntity createConversation(int senderId, int receiverId) {
        UserEntity sender = userRepository.findById(senderId).orElseThrow();
        UserEntity receiver = userRepository.findById(receiverId).orElseThrow();
        ConversationEntity conversation = new ConversationEntity(sender, receiver, Instant.now());
        return conversationRepository.save(conversation);
    }

    public List<ConversationEntity> getAllConversations() {
        return conversationRepository.findAll();
    }

    public ConversationEntity getConversationBySenderAndReceiver(int senderId, int receiverId) {
        return conversationRepository.findBySenderUseridAndReceiverUserid(senderId, receiverId);
    }

    public List<ConversationEntity> getAllConversationsByUserId(int userId) {
        return conversationRepository.findBySenderUseridOrReceiverUserid(userId, userId);
    }

    public ConversationEntity updateConversation(int id, int senderId, int receiverId) {
        ConversationEntity conversation = conversationRepository.findById(id).orElseThrow();
        UserEntity sender = userRepository.findById(senderId).orElseThrow();
        UserEntity receiver = userRepository.findById(receiverId).orElseThrow();
        conversation.setSender(sender);
        conversation.setReceiver(receiver);
        return conversationRepository.save(conversation);
    }

    public void deleteConversation(int id) {
        conversationRepository.deleteById(id);
    }

    public void setConversationRead(int conversationId) {
        ConversationEntity conversation = conversationRepository.findById(conversationId).orElseThrow();
        conversation.setRead(true);
        conversationRepository.save(conversation);
    }

    public void updateLastMessage(int conversationId, String lastMessage) {
        ConversationEntity conversation = conversationRepository.findById(conversationId).orElseThrow();
        conversation.setLastMessage(lastMessage);
        conversationRepository.save(conversation);
    }
}