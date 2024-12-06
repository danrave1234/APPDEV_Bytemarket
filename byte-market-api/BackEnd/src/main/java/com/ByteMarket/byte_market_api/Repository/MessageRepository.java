package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {
    @Query("SELECT m FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId AND m.timestamp > :lastTimestamp")
    List<MessageEntity> findNewMessages(@Param("conversationId") int conversationId, @Param("lastTimestamp") Instant lastTimestamp);

    @Query("SELECT m FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId")
    List<MessageEntity> findByConversationId(@Param("conversationId") int conversationId);
}