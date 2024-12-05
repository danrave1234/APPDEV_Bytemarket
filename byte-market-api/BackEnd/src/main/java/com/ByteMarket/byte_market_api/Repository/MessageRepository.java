package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.MessageEntity;
import com.ByteMarket.byte_market_api.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {
    @Query("SELECT m FROM MessageEntity m WHERE m.receiverId = :receiver AND m.senderId = :sender AND m.timestamp > :lastTimestamp")
    List<MessageEntity> findNewMessages(@Param("receiver") int receiver, @Param("sender") int sender, @Param("lastTimestamp") Instant lastTimestamp);
    @Query("SELECT m FROM MessageEntity m WHERE (m.senderId = :senderId AND m.receiverId = :receiverId) OR (m.senderId = :receiverId AND m.receiverId = :senderId)")
    List<MessageEntity> findConversations(@Param("senderId") Integer senderId, @Param("receiverId") Integer receiverId);
    @Query("SELECT m FROM MessageEntity m WHERE m.senderId = :senderId")
    List<MessageEntity> findBySenderId(@Param("senderId") Integer senderId);

    @Query("SELECT m FROM MessageEntity m WHERE m.receiverId = :receiverId")
    List<MessageEntity> findByReceiverId(@Param("receiverId") Integer receiverId);
}
