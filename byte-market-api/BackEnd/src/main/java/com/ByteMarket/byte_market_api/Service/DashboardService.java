package com.ByteMarket.byte_market_api.Service;


import com.ByteMarket.byte_market_api.DTO.DashboardStatsDTO;
import com.ByteMarket.byte_market_api.Repository.CustomerRepository;
import com.ByteMarket.byte_market_api.Repository.OrderRepository;
import com.ByteMarket.byte_market_api.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalRevenue(orderRepository.calculateTotalRevenue());
        stats.setTotalOrders((int) orderRepository.count());
        stats.setTotalCustomers((int) customerRepository.count());
        stats.setTotalProducts((int) productRepository.count());
        return stats;
    }
}