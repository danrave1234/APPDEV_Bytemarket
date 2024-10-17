package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tblcart")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cartid;
    private int quantity;
    private LocalDateTime dateposted;


    public CartEntity() {
        super();
    }

    public CartEntity(int quantity, LocalDateTime dateposted) {
        super();
        this.quantity = quantity;
        this.dateposted = dateposted;
    }
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customerid", nullable = false)
    private CustomerEntity customer;

    @ManyToMany
    @JoinTable(
            name = "cart_products",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductEntity> products;

    public int getCartid() {
        return cartid;
    }
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getDateposted() {
        return dateposted;
    }

    public void setDateposted(LocalDateTime dateposted) {
        this.dateposted = dateposted;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }
}
