package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblseller")
public class SellerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sellerid;
    private String sellername;
    private String phone;
    private String email;
    private String storename;

    public SellerEntity() {
        super();
    }

    public SellerEntity(String sellername, String phone, String email, String storename) {
        super();
        this.sellername = sellername;
        this.phone = phone;
        this.email = email;
        this.storename = storename;
    }

    public String getSellername() {
        return sellername;
    }

    public void setSellername(String sellername) {
        this.sellername = sellername;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStorename() {
        return storename;
    }

    public void setStorename(String storename) {
        this.storename = storename;
    }
}
