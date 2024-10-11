package com.ByteMarket.byte_market_api.Service;


import com.ByteMarket.byte_market_api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

}
