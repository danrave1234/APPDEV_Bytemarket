package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import com.ByteMarket.byte_market_api.Repository.OrderItemRepository;
import com.ByteMarket.byte_market_api.Repository.OrderRepository;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
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
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    //Get
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    public OrderEntity getOrderById(int id) {
        return orderRepository.findById(id).get();
    }
    //Add
    public OrderEntity addOrder(OrderEntity order) {
        CustomerEntity customer = customerRepository.findById(order.getCustomer().getUserid())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        order.setCustomer(customer);

        double totalPrice = 0.0;
        for (OrderItemEntity item : order.getOrderItems()) {
            ProductEntity product = productRepository.findById(item.getProduct().getProductid())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            item.setProduct(product);
            item.setOrder(order);
            item.setRated(false);

            double itemPrice = product.getPrice() * item.getQuantity();
            item.setPrice(itemPrice);

            totalPrice += itemPrice;
        }

        order.setTotalprice(totalPrice);

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

    public OrderItemEntity updateIsRatedStatus(int orderItemId, boolean isRated) {
    OrderItemEntity orderItem = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new RuntimeException("Order item not found"));
    orderItem.setRated(isRated);
    return orderItemRepository.save(orderItem);
}

    //Delete
    public OrderEntity deleteOrder(int id) {
        orderRepository.deleteById(id);
        return null;
    }
}
