package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    // Create or Update Product
    public ProductEntity saveProduct(ProductEntity product) {
        return productRepository.save(product);
    }

    // Read all products
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    // Read product by ID
    public Optional<ProductEntity> getProductById(int id) {
        return productRepository.findById(id);
    }

    // Delete product by ID
    public void deleteProductById(int id) {
        productRepository.deleteById(id);
    }
}