package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Repository.OrderRepository;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    //Get
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    public OrderEntity getOrderById(int id) {
        return orderRepository.findById(id).get();
    }
    //Add
    public OrderEntity addOrder(OrderEntity order) {
        return orderRepository.save(order);
    }
    //Update
    public OrderEntity updateOrder(int id, OrderEntity order) {
        OrderEntity orderEntity = orderRepository.findById(id).get();
        return orderRepository.save(orderEntity);
    }
    //Delete
    public OrderEntity deleteOrder(int id) {
        orderRepository.deleteById(id);
        return null;
    }
}
