package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

//Vincent
@RestController
@RequestMapping("api/seller")
public class SellerController {
@Autowired
SellerService sellerService;

//Gamita ni for Post Vincent
//    @PostMapping("/addSeller")
//    public SellerEntity addSeller(@RequestBody SellerEntity newSeller) {
//        newSeller.setRegistration(LocalDate.now());
//        newseller.setRole("Admin");
//        return sellerService.addSeller(newSeller);
//    }
}
