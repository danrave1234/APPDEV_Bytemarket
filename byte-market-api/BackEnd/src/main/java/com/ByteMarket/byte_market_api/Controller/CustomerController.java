package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;

    @PostMapping("/addCustomer")
    public CustomerEntity addCustomer(@RequestBody CustomerEntity newCustomer){
        newCustomer.setRole("Customer");
        newCustomer.setRegistration(LocalDate.now());
        return customerService.addCustomer(newCustomer);
    }
    @GetMapping("/getAllCustomer")
    public List<CustomerEntity> getAllCustomer(){
        return customerService.getAllCustomer();
    }

    @PutMapping("/updateCustomer/{id}")
    public CustomerEntity updateCustomer(@PathVariable int id, @RequestBody CustomerEntity newCustomer){
        return customerService.updateCustomer(id, newCustomer);
    }

    @DeleteMapping("/deleteCustomer/{id}")
    public CustomerEntity deleteCustomer(@PathVariable int id){
        return customerService.deleteCustomer(id);
    }
}
