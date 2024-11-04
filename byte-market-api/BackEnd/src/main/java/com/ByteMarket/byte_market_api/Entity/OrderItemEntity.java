package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "tblorderitem")
public class OrderItemEntity { //Purpose of this entity, is to track how many products is being ordered better.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderitemid;
    private int quantity;
    private double price;

    public OrderItemEntity() {
        super();
    }
    public OrderItemEntity(ProductEntity product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }


    // Relationships
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties({"orderItems", "customer"}) // Prevent recursion in OrderEntity
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"orderItems", "carts", "wishlists", "ratings"}) // Prevent recursion and seller details if unnecessary
    private ProductEntity product;

    public int getOrderitemid() {
        return orderitemid;
    }
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }

    public OrderEntity getOrder() {
        return order;
    }

    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }
}
