package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.DTO.LoginResponse;
import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Service.CustomerService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;
    @Value("${jwt.secret}")
    private String secretKey;


    @GetMapping("/getCustomerNameById/{id}")
    public String getCustomerNameById(@PathVariable int id) {
        return customerService.getCustomerNameById(id);
    }
    @PostMapping("/addCustomer")
    public CustomerEntity addCustomer(@RequestBody CustomerEntity newCustomer){
        newCustomer.setRole("Customer");
        newCustomer.setRegistration(LocalDate.now());
        return customerService.addCustomer(newCustomer);
    }
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody CustomerEntity newCustomer){

        CustomerEntity customer = customerService.authenticate(newCustomer.getUsername(), newCustomer.getPassword());

        if(customer != null) {
            // Generate the JWT token
            String token = Jwts.builder()
                    .setSubject(customer.getUsername())
                    .claim("userId", customer.getUserid())
                    .claim("role", customer.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                    .signWith(SignatureAlgorithm.HS256, secretKey)
                    .compact();

            return ResponseEntity.ok(new LoginResponse(token, customer.getUserid(), customer.getRole(), customer.getUsername()));
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
    @GetMapping("/getAllCustomer")
    public List<CustomerEntity> getAllCustomer(){
        return customerService.getAllCustomer();
    }
    @GetMapping("/getCustomerById/{id}")
    public CustomerEntity getCustomerById(@PathVariable int id){
        return customerService.getCustomerById(id);
    }
    @PutMapping("/updateCustomer/{id}")
    public CustomerEntity updateCustomer(@PathVariable int id, @RequestBody CustomerEntity newCustomer){
        return customerService.updateCustomer(id, newCustomer);
    }
    @PutMapping("/addBalanceCustomer/{id}")
    public CustomerEntity addBalance(@PathVariable int id, @RequestParam float balance){
        return customerService.addBalanceCustomer(id, balance);
    }

    @PutMapping("/subtractBalanceCustomer/{id}")
    public CustomerEntity subtractBalanceSeller(@PathVariable int id, @RequestParam float balance){
        return customerService.subtractBalanceCustomer(id, balance);
    }

    @DeleteMapping("/deleteCustomer/{id}")
    public CustomerEntity deleteCustomer(@PathVariable int id){
        return customerService.deleteCustomer(id);
    }
}
