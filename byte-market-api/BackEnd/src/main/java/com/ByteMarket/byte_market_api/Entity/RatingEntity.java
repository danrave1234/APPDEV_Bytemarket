package com.ByteMarket.byte_market_api.Entity;

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
    @JoinColumn (name = "userid")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "productid")
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
