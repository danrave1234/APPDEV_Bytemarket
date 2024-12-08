package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.DTO.DashboardStatsDTO;
import com.ByteMarket.byte_market_api.DTO.LoginResponse;
import com.ByteMarket.byte_market_api.Entity.*;
import com.ByteMarket.byte_market_api.Service.*;
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
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    AdminService adminService;
    @Autowired
    private SellerService sellerService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private ProductService productService;
    @Autowired
    private OrderService orderService;
    @Value("${jwt.secret}")
    private String secretKey;
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboardStats")
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
    //Sellers
    @GetMapping("/getAllSellers")
    public List<SellerEntity> getAllSellers() {
        return sellerService.getAllSeller();
    }
    @PostMapping("/addSeller")
    public SellerEntity addSeller(@RequestBody SellerEntity newSeller) {
        newSeller.setRegistration(LocalDate.now());
        newSeller.setRole("Seller");
        return sellerService.addSeller(newSeller);
    }
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AdminEntity newAdmin){

        AdminEntity admin = adminService.authenticate(newAdmin.getUsername(), newAdmin.getPassword());

        if(admin != null) {
            // Generate the JWT token
            String token = Jwts.builder()
                    .setSubject(admin.getUsername())
                    .claim("userId", admin.getUserid())
                    .claim("role", admin.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                    .signWith(SignatureAlgorithm.HS256, secretKey)
                    .compact();

            return ResponseEntity.ok(new LoginResponse(token, admin.getUserid(), admin.getRole(), admin.getUsername()));
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
    @PutMapping("/updateSeller/{id}")
    public SellerEntity updateSeller(@PathVariable int id, @RequestBody SellerEntity newSeller ){
        return sellerService.updateSeller(id, newSeller);
    }
    @DeleteMapping("/deleteSeller/{id}")
    public SellerEntity deleteUser(@PathVariable int id){
        return sellerService.deleteSeller(id);
    }
    //Customers
    @GetMapping("/getAllCustomer")
    public List<CustomerEntity> getAllCustomer(){
        return customerService.getAllCustomer();
    }
    @PostMapping("/addCustomer")
    public CustomerEntity addCustomer(@RequestBody CustomerEntity newCustomer){
        newCustomer.setRole("Customer");
        newCustomer.setRegistration(LocalDate.now());
        return customerService.addCustomer(newCustomer);
    }
    @PutMapping("/updateCustomer/{id}")
    public CustomerEntity updateCustomer(@PathVariable int id, @RequestBody CustomerEntity newCustomer){
        return customerService.updateCustomer(id, newCustomer);
    }

    @DeleteMapping("/deleteCustomer/{id}")
    public CustomerEntity deleteCustomer(@PathVariable int id){
        return customerService.deleteCustomer(id);
    }
    //Orders
    @GetMapping("/getAllOrder")
    public List<OrderEntity> getAllOrders() {
        return orderService.getAllOrders();
    }
    @PostMapping("/addOrder")
    public OrderEntity addOrder(@RequestBody OrderEntity order) {
        order.setOrderstatus("Pending");
        double totalPrice = order.getOrderItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        order.setTotalprice(totalPrice);

        return orderService.addOrder(order);
    }

    @PutMapping("/updateOrder/{id}")
    public OrderEntity updateOrder(@PathVariable int id, @RequestBody OrderEntity newOrder) {
        return orderService.updateOrder(id, newOrder);
    }
    //Products
    @GetMapping("/getAllProduct")
    public List<ProductEntity> getAllProduct(){
        return productService.getAllProducts();
    }
    @PostMapping("/addProduct")
    public ProductEntity addProduct(@RequestBody ProductEntity product){
        return productService.addProduct(product);
    }
    @PutMapping("/updateProduct/{id}")
    public ProductEntity updateProduct(@PathVariable int id,  @RequestBody ProductEntity product) {
        return productService.updateProduct(id, product);
    }
    @DeleteMapping("/deleteProduct/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
    }


    //Admin
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
    @DeleteMapping("/deleteAdmin/{id}")
    public void deleteAdminById(@PathVariable int id) {
        adminService.deleteAdmin(id);
    }
}
