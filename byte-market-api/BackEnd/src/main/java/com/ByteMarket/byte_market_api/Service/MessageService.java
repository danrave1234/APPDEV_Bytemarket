package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public MessageEntity addMessage(MessageEntity message) {
        message.setMessageTime(java.time.LocalDateTime.now());
        return messageRepository.save(message);
    }

    public MessageEntity getMessageById(int messageId) {
        return messageRepository.findById(messageId).
                orElseThrow(() -> new RuntimeException("Message not found"));
    }
    public List<MessageEntity> getAllMessages() {
        return messageRepository.findAll();
    }
    public MessageEntity updateMessage(int id, MessageEntity message) {
        MessageEntity existingMessage = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        existingMessage.setMessage(message.getMessage());
        existingMessage.setMessageTime(message.getMessageTime());
        return messageRepository.save(existingMessage);
    }

    public void deleteMessage(int messageId) {
        messageRepository.deleteById(messageId);
    }
}
