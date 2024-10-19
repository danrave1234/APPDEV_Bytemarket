package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tblcart")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cartid;

    // This quantity will represent how many units of a single product
    private int quantity;
    private LocalDate dateposted;

    public CartEntity() {
        super();
    }

    public CartEntity(int quantity, LocalDate dateposted) {
        super();
        this.quantity = quantity;
        this.dateposted = dateposted;
    }

    // Relationships
    @ManyToOne
    @JoinColumn(name = "customerid", nullable = false)
    @JsonIgnoreProperties({"orderItems","transaction","wishlist","cart","order", "registration", "username", "email", "phonenumber", "dateofbirth","balance"})
    private CustomerEntity customer;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Change to ManyToOne
    @JsonIgnoreProperties({"orderItems", "seller","carts"})
    private ProductEntity product;

    // Getters and Setters
    public int getCartid() {
        return cartid;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getDateposted() {
        return dateposted;
    }

    public void setDateposted(LocalDate dateposted) {
        this.dateposted = dateposted;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }
}
