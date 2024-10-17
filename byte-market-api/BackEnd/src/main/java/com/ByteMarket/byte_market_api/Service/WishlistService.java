package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import com.ByteMarket.byte_market_api.Repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    //Add
    public WishlistEntity addWishlist(WishlistEntity wishlist) {
        return wishlistRepository.save(wishlist);
    }
    //Update
    public WishlistEntity updateWishlist(WishlistEntity wishlistEntity) {
        return wishlistRepository.save(wishlistEntity);
    }
    //Delete
    public WishlistEntity deleteWishlist(int id) {
        wishlistRepository.deleteById(id);
        return null;
    }
}
