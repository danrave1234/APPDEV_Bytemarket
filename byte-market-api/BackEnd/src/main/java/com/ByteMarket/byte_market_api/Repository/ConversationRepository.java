package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, Integer> {
    List<ConversationEntity> findBySenderUseridOrReceiverUserid(int senderId, int receiverId);
    ConversationEntity findBySenderUseridAndReceiverUserid(int senderId, int receiverId);
    List<ConversationEntity> findBySenderUserid(int senderId);
    List<ConversationEntity> findByReceiverUserid(int receiverId);
}