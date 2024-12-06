package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, Integer> {
    List<ConversationEntity> findBySenderIdOrReceiverId(int senderId, int receiverId);
    ConversationEntity findBySenderIdAndReceiverId(int senderId, int receiverId);
    List<ConversationEntity> findBySenderId(int senderId);
    List<ConversationEntity> findByReceiverId(int receiverId);

}
