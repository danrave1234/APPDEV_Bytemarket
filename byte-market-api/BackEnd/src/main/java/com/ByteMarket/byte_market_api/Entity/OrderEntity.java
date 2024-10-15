package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tblorder")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderid;

    private double totalprice;
    private String orderstatus;

    public OrderEntity() {
        super();
    }
    public OrderEntity(double price, String status) {
        super();
        this.totalprice = price;
        this.orderstatus = status;
    }
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "order")
    private List<OrderItemEntity> orderItems;

    public int getOrderid() {
        return orderid;
    }

    public double getTotalprice() {
        return totalprice;
    }

    public void setTotalprice(double totalprice) {
        this.totalprice = totalprice;
    }

    public String getOrderstatus() {
        return orderstatus;
    }

    public void setOrderstatus(String orderstatus) {
        this.orderstatus = orderstatus;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }
}
