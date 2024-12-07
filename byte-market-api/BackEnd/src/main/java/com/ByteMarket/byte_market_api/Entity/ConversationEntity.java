package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "tblconversation")
public class ConversationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int conversationId;
    private Instant createdAt;
    private boolean isRead;
    private String lastMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    @JsonIgnoreProperties({"conversations", "password", "email", "phone", "createdAt", "updatedAt", "roles", "enabled", "phonenumber", "username", "registration", "dateofbirth", "address", "hibernateLazyInitializer"})
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
//    @JsonIgnoreProperties({"conversations", "password", "email", "phone", "createdAt",
//            "updatedAt", "roles", "enabled", "phonenumber", "username", "registration", "dateofbirth", "address" })
    @JsonIgnoreProperties({"conversations", "password", "email", "phone", "createdAt", "updatedAt", "roles", "enabled", "phonenumber", "username", "registration", "dateofbirth", "address", "hibernateLazyInitializer"})
    private UserEntity receiver;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MessageEntity> messages;

    public ConversationEntity() {
        super();
    }

    public ConversationEntity(UserEntity sender, UserEntity receiver, Instant createdAt) {
        this.sender = sender;
        this.receiver = receiver;
        this.createdAt = createdAt;
        this.isRead = true;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public int getConversationId() {

        return conversationId;
    }

    public void setConversationId(int conversationId) {
        this.conversationId = conversationId;
    }

    public UserEntity getSender() {
        return sender;
    }

    public void setSender(UserEntity sender) {
        this.sender = sender;
    }

    public UserEntity getReceiver() {
        return receiver;
    }

    public void setReceiver(UserEntity receiver) {
        this.receiver = receiver;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<MessageEntity> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageEntity> messages) {
        this.messages = messages;
    }
}