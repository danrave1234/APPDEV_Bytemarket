package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.*;
import com.ByteMarket.byte_market_api.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    SellerRepository sellerRepository;

    @Autowired
    OrderRepository orderRepository; // Add OrderRepository to access orders

    @Autowired
    ProductRepository productRepository;

    @Autowired
    private InventoryService inventoryService;

    public List<TransactionEntity> getAllTransaction() {
        return transactionRepository.findAll();
    }



    public TransactionEntity getTransactionById(int id) {
        return transactionRepository.findById(id).orElse(null);
    }

    public TransactionEntity addTransaction(TransactionEntity transaction, int customerId, int sellerId, int orderId) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        SellerEntity seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        double totalOrderPrice = order.getTotalprice();
        transaction.setTransactiondate(LocalDate.now());
        transaction.setAmount(totalOrderPrice);
        transaction.setCustomer(customer);
        transaction.setOrder(order);
        transactionRepository.save(transaction);

        // Add inventory items
        int itemIndex = 1; // Start numbering items from 1
        for (OrderItemEntity orderItem : order.getOrderItems()) {
            InventoryEntity inventory = new InventoryEntity();
            inventory.setProduct(orderItem.getProduct());
            inventory.setCustomer(customer);
            inventory.setQuantity(orderItem.getQuantity());
            inventory.setDateadded(LocalDateTime.now());
            inventory.setTransactionReferenceNumber(transaction.getReferenceNumber() + "-" + itemIndex);
            inventoryService.addInventoryItem(inventory);

            itemIndex++; // Increment for the next product
        }

        updateBalances(customer, seller, totalOrderPrice, "PURCHASE");
        updateOrderStatus(order);

        return transaction;
    }

    private boolean isValidTransactionType(String type) {
        return type.equals("PURCHASE") || type.equals("REFUND") || type.equals("WITHDRAWAL");
    }

    private void updateBalances(CustomerEntity customer, SellerEntity seller, double amount, String transactionType) {
        switch (transactionType) {
            case "PURCHASE":
                customer.setBalance(customer.getBalance() - amount);
                seller.setBalance(seller.getBalance() +  amount);
                break;
            case "REFUND":
                customer.setBalance(customer.getBalance() +  amount);
                seller.setBalance(seller.getBalance() -  amount);
                break;
            case "WITHDRAWAL":
                seller.setBalance(seller.getBalance() -  amount);
                break;
        }

        customerRepository.save(customer);
        sellerRepository.save(seller);
    }

    private void updateOrderStatus(OrderEntity order) {
        order.setOrderstatus("Completed");
        orderRepository.save(order);
    }

    public TransactionEntity updateTransaction(int id, TransactionEntity newTransaction) {
        TransactionEntity transaction = transactionRepository.findById(id).orElseThrow();
        transaction.setCustomer(newTransaction.getCustomer());
        transaction.setAmount(newTransaction.getAmount());
        transaction.setTransactiondate(newTransaction.getTransactiondate());
        transaction.setTransactiontype(newTransaction.getTransactiontype());
        transaction.setReferenceNumber(newTransaction.getReferenceNumber());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(int id) {
        transactionRepository.deleteById(id);
    }

    public List<Map<String, Object>> getCompletedOrderReferences() {
        List<TransactionEntity> transactions = transactionRepository.findAll();

        return transactions.stream()
                .filter(transaction -> "Completed".equalsIgnoreCase(transaction.getOrder().getOrderstatus()))
                .map(transaction -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("orderId", transaction.getOrder().getOrderid());
                    map.put("referenceNumber", transaction.getReferenceNumber());
                    return map;
                })
                .toList();
    }
}
