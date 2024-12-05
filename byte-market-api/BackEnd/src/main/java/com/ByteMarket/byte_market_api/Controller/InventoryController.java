package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.InventoryEntity;
import com.ByteMarket.byte_market_api.Service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

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

    @GetMapping("/getInventoryItemById/{id}")
    public InventoryEntity getInventoryItemById(@PathVariable int id){
        return inventoryService.getInventoryItemById(id);
    }

    @PutMapping("/updateInventoryItem/{id}")
    public InventoryEntity updateInventoryItem(@PathVariable int id,@RequestBody InventoryEntity inventory){
        return inventoryService.updateInventoryItem(id, inventory);
    }

    @DeleteMapping("/deleteInventoryItem/{id}")
    public InventoryEntity deleteInventoryItem(@PathVariable int id) {
        return inventoryService.deleteInventoryItem(id);
    }
}
