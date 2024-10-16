package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

//Vincent
@RestController
@RequestMapping("api/seller")
public class SellerController {
@Autowired
SellerService sellerService;

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

    //Not sure if this works, check the sellerService
    @PutMapping("/updateSeller/{id}")
    public SellerEntity updateSeller(@PathVariable int id, @RequestBody SellerEntity newSeller ){
        return sellerService.updateSeller(id, newSeller);
    }

    @DeleteMapping("/deleteSeller/{id}")
    public SellerEntity deleteUser(@PathVariable int id){
        return sellerService.deleteSeller(id);
    }
}
