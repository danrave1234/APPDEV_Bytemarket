package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.TransactionEntity;
import com.ByteMarket.byte_market_api.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/getAllTransaction")
    public List<TransactionEntity> getAllTransactions() {
        return transactionService.getAllTransaction();
    }

    @GetMapping("/getTransactionsById/{id}")
    public TransactionEntity getTransactionById(@PathVariable int id) {
        return transactionService.getTransactionById(id);
    }

    @PostMapping("/addTransaction/{customerId}/{sellerId}/{orderId}")
    public TransactionEntity addTransaction(
            @RequestBody TransactionEntity transaction,
            @PathVariable int customerId,
            @PathVariable int sellerId,
            @PathVariable int orderId) {
        return transactionService.addTransaction(transaction, customerId, sellerId, orderId);
    }

    @PutMapping("/updateTransaction/{id}")
    public TransactionEntity updateTransaction(
            @PathVariable int id,
            @RequestBody TransactionEntity transaction) {
        return transactionService.updateTransaction(id, transaction);
    }

    @DeleteMapping("/deleteTransaction/{id}")
    public void deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
    }
}
