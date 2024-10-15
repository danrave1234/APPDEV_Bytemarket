package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

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
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToMany
    @JoinTable(
            name = "wishlist_products",
            joinColumns = @JoinColumn(name = "wishlist_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductEntity> wishlistProducts;

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

    public List<ProductEntity> getWishlistProducts() {
        return wishlistProducts;
    }

    public void setWishlistProducts(List<ProductEntity> wishlistProducts) {
        this.wishlistProducts = wishlistProducts;
    }
}
