package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.TransactionEntity;
import com.ByteMarket.byte_market_api.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    //Get
    public List<TransactionEntity> getAllTransaction(){
        return transactionRepository.findAll();
    }

    public TransactionEntity getTransactionById(int id){
        return transactionRepository.findById(id).get();
    }

    //Add
    public TransactionEntity addTransaction(TransactionEntity transaction){
        return transactionRepository.save(transaction);
    }
    //Update

    public TransactionEntity updateTransaction(int id, TransactionEntity newTransaction){
        TransactionEntity transaction = transactionRepository.findById(id).get();
        transaction.setUser(newTransaction.getUser());
        transaction.setAmount(newTransaction.getAmount());
        transaction.setTransactiondate(newTransaction.getTransactiondate());
        transaction.setTransactiontype(newTransaction.getTransactiontype());

        return transactionRepository.save(transaction);
    }

    //Delete


}
