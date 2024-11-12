package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

//Vincent
@Entity
@Table(name = "tblseller")
public class SellerEntity extends UserEntity {
    private String sellername;
    @Column(unique = true)
    private String storename;
    private double balance;

    public SellerEntity() {
        super();
    }
    public SellerEntity(String sellername, String phone, String email, String storename, double balance) {
        super();
        this.sellername = sellername;
        this.storename = storename;
        this.balance = balance;
    }

    //Relation
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"carts", "seller", })
    private List<ProductEntity> products;
    public String getSellername() {
        return sellername;
    }
    public void setSellername(String sellername) {
        this.sellername = sellername;
    }

    public String getStorename() {
        return storename;
    }

    public void setStorename(String storename) {
        this.storename = storename;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }

}
