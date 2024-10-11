package com.ByteMarket.byte_market_api.Service;

import com.ByteMarket.byte_market_api.Repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SellerService {
    @Autowired
    private SellerRepository sellerRepository;
}
