package com.ByteMarket.byte_market_api.Controller;

import com.ByteMarket.byte_market_api.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/user")
public class UserController {
    @Autowired
    UserService userService;

}
