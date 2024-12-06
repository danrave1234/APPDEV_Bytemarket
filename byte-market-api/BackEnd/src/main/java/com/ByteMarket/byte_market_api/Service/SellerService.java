package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
import com.ByteMarket.byte_market_api.Repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class SellerService {
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ProductRepository productRepository;

    public String getSellerNameById(int id) {
        return sellerRepository.findById(id).get().getSellername();
    }
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
    public SellerEntity getSellerById(int id) {
        return sellerRepository.findById(id).get();
    }
    //Add
    public SellerEntity addSeller(SellerEntity seller){
        return sellerRepository.save(seller);
    }
    @Async
    public CompletableFuture<Void> addProducts(List<ProductEntity> products) {
        products.forEach(product -> {
            productRepository.save(product);
        });
        return CompletableFuture.completedFuture(null);
    }
    //Update
    //Not sure if the update works, my structure is not tested
    public SellerEntity updateSeller(int id, SellerEntity newSeller){
        SellerEntity seller = sellerRepository.findById(id).get();
        seller.setSellername(newSeller.getSellername());
        seller.setStorename(newSeller.getStorename());
        seller.setBalance(seller.getBalance());

        seller.setUsername(newSeller.getUsername());

        seller.setPassword(newSeller.getPassword());
        seller.setFullname(newSeller.getFullname());
        seller.setEmail(newSeller.getEmail());
        seller.setPhonenumber(newSeller.getPhonenumber());
        seller.setAddress(newSeller.getAddress());
        seller.setDateofbirth(newSeller.getDateofbirth());
        seller.setStoreimage(newSeller.getStoreimage());

        return sellerRepository.save(seller);
    }
    public SellerEntity updateSellerStoreImage(int id, SellerEntity storeImage) {
        SellerEntity seller = sellerRepository.findById(id).get();
        seller.setStoreimage(storeImage.getStoreimage());
        return sellerRepository.save(seller);
    }
    public SellerEntity addBalanceSeller(int id, float balance){
        SellerEntity seller = sellerRepository.findById(id).get();
        seller.setBalance(seller.getBalance() + balance);
        return sellerRepository.save(seller);
    }

    public SellerEntity subtractBalanceSeller(int id, float balance) {
        SellerEntity seller = sellerRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Seller not found"));

        // Check if balance to deduct exceeds current balance
        if (balance > seller.getBalance()) {
            throw new RuntimeException("Insufficient balance for this transaction.");
        }

        seller.setBalance(seller.getBalance() - balance);

        // Save updated seller entity
        return sellerRepository.save(seller);
    }

    //Delete
    public SellerEntity deleteSeller(int id){
        sellerRepository.deleteById(id);
        return null;
    }
}
