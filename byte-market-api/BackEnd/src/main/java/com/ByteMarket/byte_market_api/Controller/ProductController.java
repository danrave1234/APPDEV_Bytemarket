package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Create or Update Product
    @PostMapping("/postProduct")
    public ResponseEntity<ProductEntity> saveProduct(@RequestBody ProductEntity product) {
        ProductEntity savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // Get all products
    @GetMapping("/getProduct")
    public List<ProductEntity> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductEntity> getProductById(@PathVariable int id) {
        Optional<ProductEntity> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductById(@PathVariable int id) {
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }
}