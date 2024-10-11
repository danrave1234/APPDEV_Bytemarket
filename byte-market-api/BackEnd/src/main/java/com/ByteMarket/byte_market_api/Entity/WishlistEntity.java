package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tblwishlist")
public class WishlistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int wishlistid;
    private LocalDateTime wishlistdate;

    public WishlistEntity() {
        super();
    }
    public WishlistEntity(LocalDateTime wishlistdate) {
        super();
        this.wishlistid = wishlistid;
        this.wishlistdate = wishlistdate;
    }
    @ManyToOne
    @JoinColumn (name = "userid")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "productid")
    private ProductEntity product;

    public LocalDateTime getWishlistdate() {
        return wishlistdate;
    }

    public void setWishlistdate(LocalDateTime wishlistdate) {
        this.wishlistdate = wishlistdate;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }
}
