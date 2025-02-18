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

    public String getCustomerNameById(int id) {
        return customerRepository.findById(id).get().getFullname();
    }
    public CustomerEntity authenticate(String username, String password) {
        CustomerEntity customer = customerRepository.findByUsername(username);
        if (customer != null && customer.getPassword().equals(password)) {
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
    public CustomerEntity getCustomerById(int id){
        return customerRepository.findById(id).get();
    }
    //update
    public CustomerEntity updateCustomer(int id, CustomerEntity newCustomer){
        CustomerEntity customer = customerRepository.findById(id).get();
        customer.setUsername(newCustomer.getUsername());
        customer.setPassword(newCustomer.getPassword());
        customer.setFullname(newCustomer.getFullname());
        customer.setEmail(newCustomer.getEmail());
        customer.setPhonenumber(newCustomer.getPhonenumber());
        customer.setAddress(newCustomer.getAddress());
        customer.setDateofbirth(newCustomer.getDateofbirth());
        return customerRepository.save(customer);
    }

    public CustomerEntity addBalanceCustomer(int id, float balance){
        CustomerEntity customer = customerRepository.findById(id).get();

        customer.setBalance(customer.getBalance() + balance);

        customer.setUsername(customer.getUsername());
        customer.setPassword(customer.getPassword());
        customer.setFullname(customer.getFullname());
        customer.setEmail(customer.getEmail());
        customer.setPhonenumber(customer.getPhonenumber());
        customer.setAddress(customer.getAddress());
        customer.setDateofbirth(customer.getDateofbirth());
        return customerRepository.save(customer);
    }

    public CustomerEntity subtractBalanceCustomer(int id, float balance) {
        CustomerEntity customer = customerRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Customer not found"));

        // Check if balance to deduct exceeds current balance
        if (balance > customer.getBalance()) {
            throw new RuntimeException("Insufficient balance for this transaction.");
        }

        customer.setBalance(customer.getBalance() - balance);

        // Save updated customer entity
        return customerRepository.save(customer);
    }

    //delete
    public CustomerEntity deleteCustomer(int id){
        customerRepository.deleteById(id);
        return null;
    }
}
