package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CartEntity;
import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Repository.CartRepository;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    ProductRepository productRepository;


    //Get
    public List<CartEntity> getAllCarts() {
        return cartRepository.findAll();
    }
    public CartEntity getCartById(int id) {
        return cartRepository.findById(id).get();
    }
    //Add
    public CartEntity addCart(CartEntity cart) {
        // Fetch the customer and product entities from the database to ensure they are managed by the persistence context
        CustomerEntity customer = customerRepository.findById(cart.getCustomer().getUserid())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + cart.getCustomer().getUserid()));

        ProductEntity product = productRepository.findById(cart.getProduct().getProductid())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + cart.getProduct().getProductid()));

        // Set the managed entities into the cart
        cart.setCustomer(customer);
        cart.setProduct(product);

        // Save the cart
        return cartRepository.save(cart);
    }
    //Update
    public CartEntity updateCart(int id, CartEntity newcart) {
        CartEntity cartEntity = cartRepository.findById(id).get();
        cartEntity.setCustomer(newcart.getCustomer());
        cartEntity.setQuantity(newcart.getQuantity());
        cartEntity.setProduct(newcart.getProduct());
        return cartRepository.save(cartEntity);
    }
    //Delete
    public CartEntity deleteCart(int id) {
        cartRepository.deleteById(id);
        return null;
    }
}
