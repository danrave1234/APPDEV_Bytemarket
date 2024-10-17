package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import com.ByteMarket.byte_market_api.Repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    //Get
    public List<OrderItemEntity> getAllOrderItems() {
        return orderItemRepository.findAll();
    }
    public OrderItemEntity getOrderItemById(int id) {
        return orderItemRepository.findById(id).get();
    }
    //Add
    public OrderItemEntity addOrderItem(OrderItemEntity orderItemEntity) {
        return orderItemRepository.save(orderItemEntity);
    }
    //Update
    public OrderItemEntity updateOrderItem(OrderItemEntity orderItemEntity) {
        return orderItemRepository.save(orderItemEntity);
    }
    //Delete
    public OrderItemEntity deleteOrder(int id) {
        orderItemRepository.deleteById(id);
        return null;
    }
}
