package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Integer> {


    List<WishlistEntity> findByCustomer_Userid(int customerId);
}
