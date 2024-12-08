package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.InventoryEntity;
import com.ByteMarket.byte_market_api.Repository.InventoryRepository;
import com.ByteMarket.byte_market_api.Service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/addInventoryItem")
    public InventoryEntity addInventoryItem(@RequestBody InventoryEntity inventory){
        return inventoryService.addInventoryItem(inventory);
    }

    @GetMapping("/getAllInventoryItems")
    public List<InventoryEntity> getAllInventoryItems(){
        return inventoryService.getAllInventoryItems();
    }

    @GetMapping("/getCustomerInventory/{customerId}")
    public List<InventoryEntity> getCustomerInventory(@PathVariable int customerId) {
        return inventoryRepository.findByCustomerUserid(customerId);
    }

    @GetMapping("/getInventoryItemById/{id}")
    public InventoryEntity getInventoryItemById(@PathVariable int id){
        return inventoryService.getInventoryItemById(id);
    }

    @PutMapping("/updateInventoryItem/{id}")
    public InventoryEntity updateInventoryItem(@PathVariable int id,@RequestBody InventoryEntity inventory){
        return inventoryService.updateInventoryItem(id, inventory);
    }

    @PutMapping("/claimInventoryItem/{id}")
    public InventoryEntity claimInventoryItem(@PathVariable int id) {
        InventoryEntity inventory = inventoryService.getInventoryItemById(id);
        inventory.setClaimed(true);
        return inventoryService.addInventoryItem(inventory);
    }

    @DeleteMapping("/deleteInventoryItem/{id}")
    public InventoryEntity deleteInventoryItem(@PathVariable int id) {
        return inventoryService.deleteInventoryItem(id);
    }

}
