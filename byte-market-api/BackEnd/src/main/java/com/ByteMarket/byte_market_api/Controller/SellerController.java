package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.DTO.LoginResponse;
import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Service.SellerService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

//Vincent
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/seller")
public class SellerController {
@Autowired
SellerService sellerService;
@Value("${jwt.secret}")
private String secretKey;


    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody SellerEntity newSeller){

        SellerEntity seller = sellerService.authenticate(newSeller.getUsername(), newSeller.getPassword());

        if(seller != null) {
            // Generate the JWT token
            String token = Jwts.builder()
                    .setSubject(seller.getUsername())
                    .claim("userId", seller.getUserid())
                    .claim("role", seller.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                    .signWith(SignatureAlgorithm.HS256, secretKey)
                    .compact();

            return ResponseEntity.ok(new LoginResponse(token, seller.getUserid(), seller.getRole(), seller.getUsername()));
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
    @PostMapping("/addProducts")
    public ResponseEntity<?> addProducts(@RequestBody List<ProductEntity> products) {
        try {
            sellerService.addProducts(products);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
    @PutMapping("/updateSellerStoreImage/{id}")
    public SellerEntity updateSellerStoreImage(@PathVariable int id, @RequestBody SellerEntity storeImage){
        return sellerService.updateSellerStoreImage(id, storeImage);
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
