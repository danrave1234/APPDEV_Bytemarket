package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Entity.CustomerEntity;
import com.ByteMarket.byte_market_api.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;


    public AdminEntity authenticate(String username, String password) {
        AdminEntity admin = adminRepository.findByUsername(username);
        if(admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }

    //Get
    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }
    public AdminEntity getAdminById(int id) {
        return adminRepository.findById(id).get();
    }
    //Post
    public AdminEntity addAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }
    //Put // Update
    public AdminEntity updateAdmin(int id, AdminEntity newadmin) {
        AdminEntity admin = adminRepository.findById(id).get();
        admin.setAddress(newadmin.getAddress());
        admin.setEmail(newadmin.getEmail());
        admin.setUsername(newadmin.getUsername());
        admin.setPassword(newadmin.getPassword());
        admin.setFullname(newadmin.getFullname());
        admin.setPhonenumber(newadmin.getPhonenumber());
        admin.setDateofbirth(newadmin.getDateofbirth());

        return adminRepository.save(admin);
    }
    //Delete
    public void deleteAdmin(int id) {
        adminRepository.deleteById(id);
    }
}
