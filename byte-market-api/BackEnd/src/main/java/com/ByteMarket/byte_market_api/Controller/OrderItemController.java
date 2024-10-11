package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orderitem")
public class OrderItemController {
    @Autowired
    private OrderItemService orderItemService;
}
