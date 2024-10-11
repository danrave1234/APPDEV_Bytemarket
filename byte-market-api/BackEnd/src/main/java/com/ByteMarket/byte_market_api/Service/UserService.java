package com.ByteMarket.byte_market_api.Service;


import com.ByteMarket.byte_market_api.Entity.UserEntity;
import com.ByteMarket.byte_market_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    //Get ALL User
    public List<UserEntity> getUser(){
        return userRepository.findAll();
    }

    //Get User By ID
    public UserEntity getUserById(int id){
        return userRepository.findById(id).get();
    }

    //Post User
    public UserEntity postUser(UserEntity user){
        return userRepository.save(user);
    }

}
