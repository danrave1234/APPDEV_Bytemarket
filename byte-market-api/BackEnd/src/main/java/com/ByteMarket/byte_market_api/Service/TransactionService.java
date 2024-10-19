package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Entity.TransactionEntity;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import com.ByteMarket.byte_market_api.Repository.SellerRepository;
import com.ByteMarket.byte_market_api.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    SellerRepository sellerRepository;

    // Get all transactions
    public List<TransactionEntity> getAllTransaction() {
        return transactionRepository.findAll();
    }

    // Get transaction by ID
    public TransactionEntity getTransactionById(int id) {
        return transactionRepository.findById(id).orElse(null);
    }

    // Add transaction and update balances
    public TransactionEntity addTransaction(TransactionEntity transaction, int customerId, int sellerId) {
        CustomerEntity customer = customerRepository.findById(customerId).orElseThrow();
        SellerEntity seller = sellerRepository.findById(sellerId).orElseThrow();

        double amount = transaction.getAmount();
        String transactionType = transaction.getTransactiontype();

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (!isValidTransactionType(transactionType)) {
            throw new IllegalArgumentException("Invalid transaction type");
        }

        transaction.setTransactiondate(LocalDate.now());
        transaction.setCustomer(customer);

        // Save transaction
        transactionRepository.save(transaction);

        // Update balances based on transaction type
        updateBalances(customer, seller, amount, transactionType);

        return transaction;
    }

    private boolean isValidTransactionType(String type) {
        return type.equals("PURCHASE") || type.equals("REFUND") || type.equals("WITHDRAWAL");
    }

    private void updateBalances(CustomerEntity customer, SellerEntity seller, double amount, String transactionType) {
        switch (transactionType) {
            case "PURCHASE":
                customer.setBalance(customer.getBalance() - (float) amount);
                seller.setBalance(seller.getBalance() + amount);
                break;
            case "REFUND":
                customer.setBalance(customer.getBalance() + (float) amount);
                seller.setBalance(seller.getBalance() - amount);
                break;
        }

        // Save the updated balances
        customerRepository.save(customer);
        sellerRepository.save(seller);
    }

    // Update transaction
    public TransactionEntity updateTransaction(int id, TransactionEntity newTransaction) {
        TransactionEntity transaction = transactionRepository.findById(id).orElseThrow();
        transaction.setCustomer(newTransaction.getCustomer());
        transaction.setAmount(newTransaction.getAmount());
        transaction.setTransactiondate(newTransaction.getTransactiondate());
        transaction.setTransactiontype(newTransaction.getTransactiontype());

        return transactionRepository.save(transaction);
    }

    // Delete transaction
    public void deleteTransaction(int id) {
        transactionRepository.deleteById(id);
    }
}
