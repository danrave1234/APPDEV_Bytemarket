package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Integer> {
}
