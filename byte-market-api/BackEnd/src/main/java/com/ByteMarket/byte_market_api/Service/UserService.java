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
    public List<UserEntity> getAllUser(){
        return userRepository.findAll();
    }

    //Get User By ID / Find User By ID
    public UserEntity getUserById(int id){
        return userRepository.findById(id).get();
    }

    //Post User / Insert User
    public UserEntity addUser(UserEntity user){
        return userRepository.save(user);
    }

    //Put User / Update User
        public UserEntity updateUser(int id, UserEntity newUser){
        UserEntity userEntity = userRepository.findById(id).get();
        userEntity.setUsername(newUser.getUsername());
        userEntity.setPassword(newUser.getPassword());
        userEntity.setEmail(newUser.getEmail());
        userEntity.setAddress(newUser.getAddress());
        userEntity.setPhonenumber(newUser.getPhonenumber());
        userEntity.setDateofbirth(newUser.getDateofbirth());
        userEntity.setBalance(newUser.getBalance());
        userEntity.setFullname(newUser.getFullname());

        return userRepository.save(userEntity);
    }

    //Delete User
    public UserEntity deleteUser(int id){
        userRepository.deleteById(id);
        return null;
    }
}
