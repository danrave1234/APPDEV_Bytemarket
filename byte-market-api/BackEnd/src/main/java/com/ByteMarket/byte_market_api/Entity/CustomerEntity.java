package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

//Vincent
@Entity
@Table(name = "tblcustomer")
public class CustomerEntity extends UserEntity {
    //No id, uses superclass ID
    private float balance;
}
