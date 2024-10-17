package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

}
