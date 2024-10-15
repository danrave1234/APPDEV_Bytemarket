package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

//Vincent
@Entity
@Table(name = "tblseller")
public class SellerEntity extends UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sellerid;
    private String sellername;
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

    public String getSellername() {
        return sellername;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
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
}
