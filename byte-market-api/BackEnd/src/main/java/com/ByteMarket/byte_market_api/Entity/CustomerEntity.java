package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

//Vincent
@Entity
@Table(name = "tblcustomer")
public class CustomerEntity extends UserEntity {
    //No id, uses superclass ID
    private float balance;

    public CustomerEntity() {
        super();
    }

    public CustomerEntity(float balance) {
        super();
        this.balance = balance;
    }

    //Relation
    @OneToMany(mappedBy = "customer")
    private List<OrderEntity> order;

    @OneToMany(mappedBy = "customer")
    private List<CartEntity> cart;

    @OneToMany(mappedBy = "customer")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<WishlistEntity> wishlist;

    @OneToMany(mappedBy = "customer")
    private List<RatingEntity> rating;

    @OneToMany(mappedBy = "customer")
    private List<TransactionEntity> transaction;

    public float getBalance(){
        return balance;
    }

    public void setBalance(float balance){
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
}
