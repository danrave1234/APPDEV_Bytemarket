package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbltransaction")
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionid;
    private LocalDateTime transactiondate;
    private double amount;
    private String transactiontype;

    public TransactionEntity() {
        super();
    }

    public TransactionEntity(LocalDateTime transactiondate, double amount, String transactiontype) {
        super();
        this.transactiondate = transactiondate;
        this.amount = amount;
        this.transactiontype = transactiontype;
    }

    // Relationships
    @ManyToOne
    @JoinColumn(name = "customerid", nullable = false)
    private CustomerEntity customer;

    public int getTransactionid() {
        return transactionid;
    }
    public LocalDateTime getTransactiondate() {
        return transactiondate;
    }

    public void setTransactiondate(LocalDateTime transactiondate) {
        this.transactiondate = transactiondate;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getTransactiontype() {
        return transactiontype;
    }

    public void setTransactiontype(String transactiontype) {
        this.transactiontype = transactiontype;
    }

    public CustomerEntity getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerEntity customer) {
        this.customer = customer;
    }
}
