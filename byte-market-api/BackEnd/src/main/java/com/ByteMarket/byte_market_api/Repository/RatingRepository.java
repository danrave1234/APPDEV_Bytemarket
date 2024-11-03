package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.RatingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Integer> {
    List<RatingEntity> findByCustomer_Userid(int customerId);
    List<RatingEntity> findByProduct_Productid(int productId);
}