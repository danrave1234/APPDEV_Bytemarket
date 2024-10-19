package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import com.ByteMarket.byte_market_api.Repository.OrderRepository;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CustomerRepository customerRepository;
    //Get
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    public OrderEntity getOrderById(int id) {
        return orderRepository.findById(id).get();
    }
    //Add
    public OrderEntity addOrder(OrderEntity order) {
//        // Fetch the customer from the database
//        CustomerEntity customer = customerRepository.findById(order.getCustomer().getUserid())
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        order.setCustomer(customer);
//
//        for (OrderItemEntity item : order.getOrderItems()) {
//            item.setOrder(order);  // Set the order for each order item
//            item.setPrice(item.getProduct().getPrice() * item.getQuantity()); // Calculate price based on quantity and product price
//        }
//
//        order.calculateTotalPrice();
        return orderRepository.save(order);
    }
    //Update
    public OrderEntity updateOrder(int id, OrderEntity newOrder) {
        OrderEntity orderEntity = orderRepository.findById(id).get();
        orderEntity.setOrderItems(newOrder.getOrderItems());
        orderEntity.setCustomer(newOrder.getCustomer());
        orderEntity.setOrderstatus(newOrder.getOrderstatus());
        orderEntity.setTotalprice(newOrder.getTotalprice());

        return orderRepository.save(orderEntity);
    }
    //Delete
    public OrderEntity deleteOrder(int id) {
        orderRepository.deleteById(id);
        return null;
    }
}
