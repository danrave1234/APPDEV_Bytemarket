package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

//Vincent
@Entity
@Table(name = "tblcustomer")
public class CustomerEntity extends UserEntity {
    //No id, uses superclass ID
    private double balance;

    public CustomerEntity() {
        super();
    }

    public CustomerEntity(float balance) {
        super();
        this.balance = balance;
    }

    //Relation
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"customer"})
    private List<OrderEntity> order;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"customer"})
    private List<CartEntity> cart;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"customer"})
    private List<WishlistEntity> wishlist;

    @OneToMany(mappedBy = "customer")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<RatingEntity> rating;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties({"customer"})
    private List<TransactionEntity> transaction;

    @OneToMany(mappedBy = "customer")
    private List<InventoryEntity> inventory;

    public void loadEWallet(float amount){
        this.balance += amount;
    }

    public double getBalance(){
        return balance;
    }

    public void setBalance(double balance){
        this.balance = balance;
    }

    public List<CartEntity> getCart() {
        return cart;
    }

    public void setCart(List<CartEntity> cart){
        this.cart = cart;
    }

    public List<OrderEntity> getOrder(){
        return  order;
    }

    public void setOrder(List<OrderEntity> order){
        this.order = order;
    }

    public List<WishlistEntity> getWishlist(){
        return wishlist;
    }

    public void setWishlist(List<WishlistEntity> wishlist){
        this.wishlist = wishlist;
    }

    public List<RatingEntity> getRating(){
        return rating;
    }

    public void setRating(List<RatingEntity> rating){
        this.rating = rating;
    }

    public List<TransactionEntity> getTransaction() {
        return transaction;
    }

    public void setTransaction(List<TransactionEntity> transaction) {
        this.transaction = transaction;
    }

    public List<InventoryEntity> getInventory() {
        return inventory;
    }

    public void setInventory(List<InventoryEntity> inventory) {
        this.inventory = inventory;
    }
}
