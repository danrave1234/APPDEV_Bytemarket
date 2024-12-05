package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Entity.InventoryEntity;
import com.ByteMarket.byte_market_api.Repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    public InventoryEntity addInventoryItem(InventoryEntity inventory){
        return inventoryRepository.save(inventory);
    }

    public List<InventoryEntity> getAllInventoryItems(){
        return inventoryRepository.findAll();
    }

    public InventoryEntity getInventoryItemById(int id){
        return inventoryRepository.findById(id).get();
    }

    public InventoryEntity updateInventoryItem(int id, InventoryEntity updateInventory){
        Optional<InventoryEntity> optionalInventory = inventoryRepository.findById(id);
        if (optionalInventory.isPresent()){
            InventoryEntity inventoryEntity = optionalInventory.get();
            inventoryEntity.setQuantity(updateInventory.getQuantity());
            inventoryEntity.setTransactionReferenceNumber(updateInventory.getTransactionReferenceNumber());
            inventoryEntity.setProduct(updateInventory.getProduct());
            inventoryEntity.setCustomer(updateInventory.getCustomer());
            return inventoryRepository.save(inventoryEntity);
        }else {
            throw new RuntimeException("Inventory item not found with id " + id);
        }
    }

    public InventoryEntity deleteInventoryItem(int id) {
        inventoryRepository.deleteById(id);
        return null;
    }
}
