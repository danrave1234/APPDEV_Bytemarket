package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblmessage")
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageId;
    @Column(columnDefinition = "TEXT")
    private String message;
    private Instant timestamp;
    private int senderId;
    private int receiverId;

    public MessageEntity() {
        super();
    }
    public MessageEntity(String message, Instant messageTime, int senderId, int receiverId) {
        super();
        this.message = message;
        this.timestamp = messageTime;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }
}
