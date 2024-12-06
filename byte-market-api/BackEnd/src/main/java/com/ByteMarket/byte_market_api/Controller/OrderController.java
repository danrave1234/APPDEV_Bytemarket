package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import com.ByteMarket.byte_market_api.Service.OrderService;
import com.ByteMarket.byte_market_api.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/order")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private TransactionService transactionService;

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

    @PutMapping("/orderItem/{orderItemId}/isRated")
    public OrderItemEntity updateIsRated(@PathVariable int orderItemId, @RequestParam boolean isRated) {
        return orderService.updateIsRatedStatus(orderItemId, isRated);
    }
    @DeleteMapping("/deleteOrder/{id}")
    public void deleteOrder(@PathVariable int id) {
        orderService.deleteOrder(id);
    }
    @GetMapping("/getCompletedOrderReferences")
    public List<Map<String, Object>> getCompletedOrderReferences() {
        return transactionService.getCompletedOrderReferences();
    }


}
