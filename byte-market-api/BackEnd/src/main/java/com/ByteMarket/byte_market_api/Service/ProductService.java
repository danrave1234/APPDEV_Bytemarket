package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.ProductEntity;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    //Get
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }
    public ProductEntity getProductById(int id) {
        return productRepository.findById(id).get();
    }
//    public List<ProductEntity> getProductsBySeller(int userid) {
//        return productRepository.findBySeller(userid);
//    }
    //Add
    public ProductEntity addProduct(ProductEntity product) {
        return productRepository.save(product);
    }
    //Update
    public ProductEntity updateProduct(int id, ProductEntity product) {
        ProductEntity productEntity = productRepository.findById(id).get();
        productEntity.setCategory(product.getCategory());
        productEntity.setPrice(product.getPrice());
        productEntity.setQuantity(product.getQuantity());
        productEntity.setProductname(product.getProductname());
        productEntity.setDescription(product.getDescription());
        productEntity.setImage(product.getImage());

        return productRepository.save(productEntity);
    }
    //Delete
    public ProductEntity deleteProduct(int id) {
        productRepository.deleteById(id);
        return null;
    }
}