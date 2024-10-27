package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Entity.TransactionEntity;
import com.ByteMarket.byte_market_api.Repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SellerService {
    @Autowired
    private SellerRepository sellerRepository;

    public SellerEntity authenticate(String username, String password) {
        SellerEntity seller = sellerRepository.findByUsername(username);
        if(seller.getPassword().equals(password)) {
            return seller;
        }
        return null;
    }
    //Get
    public List<SellerEntity> getAllSeller(){
        return sellerRepository.findAll();
    }
    //Add
    public SellerEntity addSeller(SellerEntity seller){
        return sellerRepository.save(seller);
    }
    //Update
    //Not sure if the update works, my structure is not tested
    public SellerEntity updateSeller(int id, SellerEntity newSeller){
        SellerEntity seller = sellerRepository.findById(id).get();
        seller.setSellername(newSeller.getSellername());
        seller.setStorename(newSeller.getStorename());
        seller.setBalance(newSeller.getBalance());

        seller.setUsername(newSeller.getUsername());
        seller.setPassword(newSeller.getPassword());
        seller.setFullname(newSeller.getFullname());
        seller.setEmail(newSeller.getEmail());
        seller.setPhonenumber(newSeller.getPhonenumber());
        seller.setAddress(newSeller.getAddress());
        seller.setDateofbirth(newSeller.getDateofbirth());
        return sellerRepository.save(seller);
    }

    //Delete
    public SellerEntity deleteSeller(int id){
        sellerRepository.deleteById(id);
        return null;
    }
}
