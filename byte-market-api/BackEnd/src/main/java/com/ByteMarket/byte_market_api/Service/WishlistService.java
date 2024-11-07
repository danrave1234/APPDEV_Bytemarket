package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import com.ByteMarket.byte_market_api.Repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    //Get
    public List<WishlistEntity> getAllWishlists() {
        return wishlistRepository.findAll();
    }

    public WishlistEntity getWishlistById(int id) {
        return wishlistRepository.findById(id).get();
    }

    public List<WishlistEntity> getWishlistsByUserId(int customerId) {
        return wishlistRepository.findByCustomer_Userid(customerId);
    }

    //Add
    public WishlistEntity addWishlist(WishlistEntity wishlist) {
        return wishlistRepository.save(wishlist);
    }

    //Update
    public WishlistEntity updateWishlist(int id, WishlistEntity newwishlistEntity) {
        WishlistEntity wishlist = wishlistRepository.findById(id).get();
        wishlist.setWishlistProducts(newwishlistEntity.getWishlistProducts());
        wishlist.setCustomer(newwishlistEntity.getCustomer());
        return wishlistRepository.save(wishlist);
    }

    //Delete
    public WishlistEntity deleteWishlist(int id) {
        wishlistRepository.deleteById(id);
        return null;
    }
}
