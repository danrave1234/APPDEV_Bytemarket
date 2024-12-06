package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tbltransaction")
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionid;
    private LocalDate transactiondate;
    private double amount;
    private String transactiontype;

    private String referenceNumber;


    public TransactionEntity() {
        super();
        this.referenceNumber = UUID.randomUUID().toString();
    }

    public TransactionEntity(LocalDate transactiondate, double amount, String transactiontype) {
        super();
        this.transactiondate = transactiondate;
        this.amount = amount;
        this.transactiontype = transactiontype;
        this.referenceNumber = UUID.randomUUID().toString();
    }

    // Relationships
    @ManyToOne
    @JoinColumn(name = "customerid", nullable = false)
    @JsonIgnoreProperties({"fullname", "email", "phonenumber", "dateofbirth", "order", "cart", "wishlist", "transaction", "registration" })
    private CustomerEntity customer;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false) // Link transaction to an order
    @JsonIgnoreProperties({"customer", "orderItems"}) // Prevent recursion
    private OrderEntity order;

    // Getters and setters...

    public int getTransactionid() {
        return transactionid;
    }

    public LocalDate getTransactiondate() {
        return transactiondate;
    }

    public void setTransactiondate(LocalDate transactiondate) {
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

    public OrderEntity getOrder() {
        return order;
    }

    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
}
