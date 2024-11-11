package com.ByteMarket.byte_market_api.Repository;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
//import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    //List<ProductEntity> findBySeller(SellerEntity  userid);
}
