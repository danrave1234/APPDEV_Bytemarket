package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CartEntity;
import com.ByteMarket.byte_market_api.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    //Get
    public List<CartEntity> getAllCarts() {
        return cartRepository.findAll();
    }
    public CartEntity getCartById(int id) {
        return cartRepository.findById(id).get();
    }
    //Add
    public CartEntity addCart(CartEntity cart) {
        return cartRepository.save(cart);
    }
    //Update
    public CartEntity updateCart(CartEntity cart) {
        return cartRepository.save(cart);
    }
    //Delete
    public CartEntity deleteCart(int id) {
        cartRepository.deleteById(id);
        return null;
    }
}
