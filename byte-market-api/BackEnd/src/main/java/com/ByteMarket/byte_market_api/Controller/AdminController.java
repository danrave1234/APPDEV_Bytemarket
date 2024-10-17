package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.AdminEntity;
import com.ByteMarket.byte_market_api.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @GetMapping("/getAllAdmin")
    public List<AdminEntity> getAllAdmin() {
        return adminService.getAllAdmins();
    }
    @GetMapping("/getAdminById/{id}")
    public AdminEntity getAdminById(@PathVariable int id) {
        return adminService.getAdminById(id);
    }
    @PostMapping("/addAdmin")
    public AdminEntity addAdmin(@RequestBody AdminEntity admin) {
        admin.setRegistration(LocalDate.now());
        admin.setRole("Admin");
        return adminService.addAdmin(admin);
    }
    @PutMapping("/updateAdmin/{id}")
    public AdminEntity updateAdminById(@PathVariable int id, @RequestBody AdminEntity newadmin) {
        return adminService.updateAdmin(id, newadmin);
    }
    @DeleteMapping("/deleteAdmin")
    public void deleteAdminById(@PathVariable int id) {
        adminService.deleteAdmin(id);
    }
}
