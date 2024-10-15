package com.ByteMarket.byte_market_api.Entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
//Danrave
@Entity
@Table(name = "tblUser")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;

    private String username;
    private String password;
    private String email;
    private String fullname;
    private String phonenumber;
    private LocalDate registration;
    private String address; //Kuan rani kanang like street, barangay
    private LocalDate dateofbirth; //LocalDate datatype


    public UserEntity() {
        super();
    }

    public UserEntity(String username, String password, String email, String phonenumber, String address, String city, LocalDate dateofbirth, LocalDate registration, String fullname, double balance) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phonenumber = phonenumber;
        this.address = address;
        this.dateofbirth = dateofbirth;
        this.registration = registration;
        this.fullname = fullname;
    }

    @OneToMany
    @JoinColumn (name = "orderid")
    private List<OrderEntity> orders;

    @OneToMany
    @JoinColumn(name = "ratingid")
    private List<RatingEntity> ratings;

    @OneToMany
    @JoinColumn(name = "cartid")
    private List<CartEntity> carts;

    @OneToMany
    @JoinColumn(name = "wishlistid")
    private List<WishlistEntity> wishlists;

    public List<OrderEntity> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderEntity> orders) {
        this.orders = orders;
    }

    public List<RatingEntity> getRatings() {
        return ratings;
    }

    public void setRatings(List<RatingEntity> ratings) {
        this.ratings = ratings;
    }

    public List<CartEntity> getCarts() {
        return carts;
    }

    public void setCarts(List<CartEntity> carts) {
        this.carts = carts;
    }

    public List<WishlistEntity> getWishlists() {
        return wishlists;
    }

    public void setWishlists(List<WishlistEntity> wishlists) {
        this.wishlists = wishlists;
    }

    public String getUsername() {
        return username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public LocalDate getRegistration() {
        return registration;
    }

    public void setRegistration(LocalDate registration) {
        this.registration = registration;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateofbirth() {
        return dateofbirth;
    }

    public void setDateofbirth(LocalDate dateofbirth) {
        this.dateofbirth = dateofbirth;
    }


}
