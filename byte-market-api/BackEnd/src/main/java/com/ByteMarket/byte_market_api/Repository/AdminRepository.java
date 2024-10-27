package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Integer> {
    AdminEntity findByUsername(String username);

}
