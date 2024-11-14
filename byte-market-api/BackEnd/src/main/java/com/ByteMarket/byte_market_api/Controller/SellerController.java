package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

//Vincent
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/seller")
public class SellerController {
@Autowired
SellerService sellerService;

    @PostMapping("/auth/login")
    public SellerEntity login(@RequestBody CustomerEntity newSeller){
        SellerEntity seller = sellerService.authenticate(newSeller.getUsername(), newSeller.getPassword());

        if(seller != null){
            return seller;
        }else{
            throw new RuntimeException("Invalid username or password");
        }
    }
    @PostMapping("/addSeller")
    public SellerEntity addSeller(@RequestBody SellerEntity newSeller) {
        newSeller.setRegistration(LocalDate.now());
        newSeller.setRole("Seller");
        return sellerService.addSeller(newSeller);
    }

    @GetMapping("/getAllSeller")
    public List<SellerEntity> getAllSeller(){
        return sellerService.getAllSeller();
    }

    @GetMapping("/getSellerById/{id}")
    public SellerEntity getSellerById(@PathVariable int id){
        return sellerService.getSellerById(id);
    }

    //Not sure if this works, check the sellerService
    @PutMapping("/updateSeller/{id}")
    public SellerEntity updateSeller(@PathVariable int id, @RequestBody SellerEntity newSeller ){
        return sellerService.updateSeller(id, newSeller);
    }

    @PutMapping("/addBalanceSeller/{id}")
    public SellerEntity addBalanceSeller(@PathVariable int id, @RequestParam float balance){
        return sellerService.addBalanceSeller(id, balance);
    }

    @PutMapping("/subtractBalanceSeller/{id}")
    public SellerEntity subtractBalanceSeller(@PathVariable int id, @RequestParam float balance){
        return sellerService.subtractBalanceSeller(id, balance);
    }

    @DeleteMapping("/deleteSeller/{id}")
    public SellerEntity deleteUser(@PathVariable int id){
        return sellerService.deleteSeller(id);
    }
}
