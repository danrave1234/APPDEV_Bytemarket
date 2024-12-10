package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "tblinventory")
public class InventoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int inventoryid;
    private LocalDateTime dateadded;
    private int quantity;
    private String transactionReferenceNumber;
    private boolean isClaimed = false;

    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    @JsonIgnoreProperties({"inventory", "carts", "wishlists", "ratings", "orderItems", "seller", })
    private ProductEntity product;

    @ManyToOne
    @JoinColumn(name = "customerid", nullable = false)
    @JsonIgnoreProperties({"inventory", "cart", "wishlist", "transaction", "rating", "order", ""})
    private CustomerEntity customer;

    public int getInventoryid() {
        return inventoryid;
    }

    public LocalDateTime getDateadded() {
        return dateadded;
    }

    public void setDateadded(LocalDateTime dateadded) {
        this.dateadded = dateadded;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getTransactionReferenceNumber() {
        return transactionReferenceNumber;
    }

    public void setTransactionReferenceNumber(String transactionReferenceNumber) {
        this.transactionReferenceNumber = transactionReferenceNumber;
    }

    public InventoryEntity(){
        super();
    }

    public InventoryEntity(LocalDateTime dateadded, int quantity, String transactionReferenceNumber) {
        this.dateadded = dateadded;
        this.quantity = quantity;
        this.transactionReferenceNumber = transactionReferenceNumber;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public boolean isClaimed() {
        return isClaimed;
    }

    public void setClaimed(boolean claimed) {
        isClaimed = claimed;
    }
}
