package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public MessageEntity addMessage(MessageEntity message) {
        return messageRepository.save(message);
    }

    public List<MessageEntity> getAllConversation(int conversationId) {
        return messageRepository.findByConversationId(conversationId);
    }

    public List<MessageEntity> getNewMessages(int conversationId, Instant lastTimestamp) {
        return messageRepository.findNewMessages(conversationId, lastTimestamp);
    }

    public MessageEntity getMessageById(int messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public List<MessageEntity> getAllMessages() {
        return messageRepository.findAll();
    }

    public MessageEntity updateMessage(int id, MessageEntity message) {
        MessageEntity existingMessage = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        existingMessage.setMessage(message.getMessage());
        existingMessage.setTimestamp(message.getTimestamp());
        return messageRepository.save(existingMessage);
    }

    public void deleteMessage(int messageId) {
        messageRepository.deleteById(messageId);
    }
}