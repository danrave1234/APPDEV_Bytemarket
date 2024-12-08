package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.DTO.DashboardStatsDTO;
import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Query("SELECT SUM(o.totalprice) FROM OrderEntity o WHERE o.orderstatus = 'Completed'")
    double calculateTotalRevenue();
}
