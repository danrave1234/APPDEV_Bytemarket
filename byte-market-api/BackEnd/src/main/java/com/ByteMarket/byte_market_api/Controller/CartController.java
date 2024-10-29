package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.CartEntity;
import com.ByteMarket.byte_market_api.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/getAllCart")
    public List<CartEntity> getAllCart() {
        return cartService.getAllCarts();
    }
    @GetMapping("/getCartById/{id}")
    public CartEntity getCartById(@PathVariable int id) {
        return cartService.getCartById(id);
    }
    @PostMapping("/addCart")
    public CartEntity addCart(@RequestBody CartEntity cart) {
        cart.setDateposted(LocalDate.now());
        return cartService.addCart(cart);
    }
    @PutMapping("/updateCart/{id}")
    public CartEntity updateCart(@PathVariable int id, @RequestBody CartEntity cart) {
        return cartService.updateCart(id, cart);
    }
    @DeleteMapping("/deleteCart")
    public CartEntity deleteCart(@PathVariable int id) {
        return cartService.deleteCart(id);
    }
}
