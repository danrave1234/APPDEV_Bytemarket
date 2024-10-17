package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblwishlist")
public class WishlistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int wishlistid;
    private LocalDate wishlistdate;

    public WishlistEntity() {
        super();
    }
    public WishlistEntity(LocalDate wishlistdate) {
        super();
        this.wishlistid = wishlistid;
        this.wishlistdate = wishlistdate;
    }
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customerid", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private CustomerEntity customer;

    @ManyToMany
    @JoinTable(
            name = "wishlist_products",
            joinColumns = @JoinColumn(name = "wishlist_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductEntity> wishlistProducts;

    public int getWishlistid() {
        return wishlistid;
    }
    public LocalDate getWishlistdate() {
        return wishlistdate;
    }

    public void setWishlistdate(LocalDate wishlistdate) {
        this.wishlistdate = wishlistdate;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }

    public List<ProductEntity> getWishlistProducts() {
        return wishlistProducts;
    }

    public void setWishlistProducts(List<ProductEntity> wishlistProducts) {
        this.wishlistProducts = wishlistProducts;
    }
}
