package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.InventoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Integer> {
    List<InventoryEntity> findByCustomerUserid(int userid);
}
