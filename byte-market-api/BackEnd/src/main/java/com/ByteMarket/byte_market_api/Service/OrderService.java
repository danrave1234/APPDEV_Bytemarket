package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.OrderEntity;
import com.ByteMarket.byte_market_api.Entity.OrderItemEntity;
import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
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
    //Get
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    public OrderEntity getOrderById(int id) {
        return orderRepository.findById(id).get();
    }
    //Add
    public OrderEntity addOrder(OrderEntity order) {
        // Fetch the customer from the database
        CustomerEntity customer = customerRepository.findById(order.getCustomer().getUserid())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        order.setCustomer(customer);

        // Calculate total price and set order for each item
        double totalPrice = 0.0;
        for (OrderItemEntity item : order.getOrderItems()) {
            // Fetch the product from the database
            ProductEntity product = productRepository.findById(item.getProduct().getProductid())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            item.setProduct(product);
            item.setOrder(order);  // Set the order for each order item

            // Calculate the price for this item (product price * quantity)
            double itemPrice = product.getPrice() * item.getQuantity();
            item.setPrice(itemPrice); // Set the item's price

            totalPrice += itemPrice; // Add to total price
        }

        // Set the total price in the order
        order.setTotalprice(totalPrice);

        // Save the order and its items
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
