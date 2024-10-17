package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.WishlistEntity;
import com.ByteMarket.byte_market_api.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/getAllWishlist")
    public List<WishlistEntity> GetAllWishList() {
        return wishlistService.getAllWishlists();
    }
    @GetMapping("/getWishlistById/{id}")
    public WishlistEntity GetWishListById(@PathVariable int id) {
        return wishlistService.getWishlistById(id);
    }
    @PostMapping("/addWishlist")
    public WishlistEntity AddWishlist(@RequestBody WishlistEntity wishlistEntity) {
        return wishlistService.addWishlist(wishlistEntity);
    }
    @PutMapping("/updateWishlist/{id}")
    public WishlistEntity UpdateWishlist(@PathVariable int id, @RequestBody WishlistEntity wishlistEntity) {
        return wishlistService.updateWishlist(id, wishlistEntity);
    }
    @DeleteMapping("/deleteWishlist/{id}")
    public void DeleteWishlist(@PathVariable int id) {
        wishlistService.deleteWishlist(id);
    }
}
