package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tblrating")
public class RatingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ratingid;
    private int score;
    private String ratingtext;
    private LocalDate ratingdate;

    public RatingEntity() {
        super();
    }

    public RatingEntity(int score, String ratingtext, LocalDate ratingdate) {
        super();
        this.score = score;
        this.ratingtext = ratingtext;
        this.ratingdate = ratingdate;
    }
    @ManyToOne
    @JoinColumn (name = "customerid")
    @JsonIgnoreProperties({"fullname", "email", "phonenumber", "dateofbirth", "order", "cart", "wishlist", "transaction", "registration", "balance"})
    private CustomerEntity customer;

    @ManyToOne
    @JoinColumn(name = "productid")
    @JsonIgnoreProperties({"carts", "orderItems", "wishlists", "ratings"})
    private ProductEntity product;

    public int getRatingid() {
        return ratingid;
    }
    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getRatingtext() {
        return ratingtext;
    }

    public void setRatingtext(String ratingtext) {
        this.ratingtext = ratingtext;
    }

    public LocalDate getRatingdate() {
        return ratingdate;
    }

    public void setRatingdate(LocalDate ratingdate) {
        this.ratingdate = ratingdate;
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
