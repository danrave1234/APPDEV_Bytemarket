package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/getAllOrder")
    public List<OrderEntity> getAllOrders() {
        return orderService.getAllOrders();
    }
    @GetMapping("/getOrderById/{id}")
    public OrderEntity getOrderById(@PathVariable int id) {
        return orderService.getOrderById(id);
    }
    @PostMapping("/addOrder")
    public OrderEntity addOrder(@RequestBody OrderEntity order) {
        order.setOrderstatus("Pending");
        double totalPrice = order.getOrderItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        order.setTotalprice(totalPrice);

        return orderService.addOrder(order);
    }

    @PutMapping("/updateOrder/{id}")
    public OrderEntity updateOrder(@PathVariable int id, @RequestBody OrderEntity newOrder) {
        return orderService.updateOrder(id, newOrder);
    }
}
