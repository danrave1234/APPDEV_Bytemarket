package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/product")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/getAllProduct")
    public List<ProductEntity> getAllProduct(){
        return productService.getAllProducts();
    }
    @GetMapping("/getProductById/{id}")
    public ProductEntity getProductById(@PathVariable int id){
        return productService.getProductById(id);
    }
//    @GetMapping("/getProductsBySeller/{id}")
//    public List<ProductEntity> getProductsBySeller(@PathVariable int id) {
//        return productService.getProductsBySeller(id);
//    }
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
}