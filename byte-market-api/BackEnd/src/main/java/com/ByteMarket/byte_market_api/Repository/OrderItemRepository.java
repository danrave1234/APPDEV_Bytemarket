package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Integer> {
  //add here
}

