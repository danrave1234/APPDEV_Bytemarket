package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.RatingEntity;
import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Integer> {
}
