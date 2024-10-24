package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Entity.SellerEntity;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;


    public CustomerEntity authenticate(String username, String password) {
        CustomerEntity customer = customerRepository.findByUsername(username);
        if(customer.getPassword().equals(password)) {
            return customer;
        }
        return null;
    }
    //add
    public CustomerEntity addCustomer(CustomerEntity customer){
        return customerRepository.save(customer);
    }
    //get
    public List<CustomerEntity> getAllCustomer(){
        return customerRepository.findAll();
    }
    //update
    public CustomerEntity updateCustomer(int id, CustomerEntity newCustomer){
        CustomerEntity customer = customerRepository.findById(id).get();
        customer.setBalance(newCustomer.getBalance());
        customer.setUsername(customer.getUsername());
        customer.setPassword(customer.getPassword());
        customer.setFullname(customer.getFullname());
        customer.setEmail(customer.getEmail());
        customer.setPhonenumber(customer.getPhonenumber());
        customer.setAddress(customer.getAddress());
        customer.setDateofbirth(customer.getDateofbirth());
        return customerRepository.save(customer);
    }
    //delete
    public CustomerEntity deleteCustomer(int id){
        customerRepository.deleteById(id);
        return null;
    }
}
