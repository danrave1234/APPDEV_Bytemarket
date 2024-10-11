package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tblproduct")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productid;
    private String productname;
    private double price;
    private int quantity;
    private String category;

    public ProductEntity() {
        super();
    }
    public ProductEntity(String productname, double price, int quantity, String category) {
        super();
        this.productname = productname;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    @OneToMany(mappedBy = "product")
    private List<OrderItemEntity> orderItems;

    @OneToMany(mappedBy = "product")
    private List<CartEntity> cart;

    @OneToMany(mappedBy = "product")
    private List<WishlistEntity> wishlist;

    @OneToMany(mappedBy = "product")
    private List<RatingEntity> rating;

    @ManyToOne
    @JoinColumn (name = "sellerid")
    private SellerEntity seller;

    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }

    public List<CartEntity> getCart() {
        return cart;
    }

    public void setCart(List<CartEntity> cart) {
        this.cart = cart;
    }

    public List<WishlistEntity> getWishlist() {
        return wishlist;
    }

    public void setWishlist(List<WishlistEntity> wishlist) {
        this.wishlist = wishlist;
    }

    public List<RatingEntity> getRating() {
        return rating;
    }

    public void setRating(List<RatingEntity> rating) {
        this.rating = rating;
    }

    public SellerEntity getSeller() {
        return seller;
    }

    public void setSeller(SellerEntity seller) {
        this.seller = seller;
    }
}
