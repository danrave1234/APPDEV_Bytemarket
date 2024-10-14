package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Entity.UserEntity;
import com.ByteMarket.byte_market_api.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserService userService;



    @GetMapping("/getAllUser")
    public List<UserEntity> getAllUser(){
        return userService.getAllUser();
    }

    @GetMapping("/getUserById/{id}")
    public UserEntity getUserById(@PathVariable int id){
        return userService.getUserById(id);
    }

    @PostMapping("/addUser")
    public UserEntity addUser(@RequestBody UserEntity user){
        user.setRegistration(LocalDate.now());
        return userService.addUser(user);
    }

    @PutMapping("/updateUser/{id}")
    public UserEntity updateUser(@PathVariable int id, @RequestBody UserEntity newUser){
        return userService.updateUser(id, newUser);
    }

    @DeleteMapping("/deleteUser/{id}")
    public UserEntity deleteUser(@PathVariable int id){
        return userService.deleteUser(id);
    }
}
