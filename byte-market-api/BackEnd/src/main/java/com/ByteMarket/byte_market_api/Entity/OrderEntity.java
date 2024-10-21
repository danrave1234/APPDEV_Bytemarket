    package com.ByteMarket.byte_market_api.Entity;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;

    import java.util.List;

    @Entity
    @Table(name = "tblorder")
    public class OrderEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int orderid;

        private double totalprice;
        private String orderstatus;

        public OrderEntity() {
            super();
        }
        public OrderEntity(double price, String status) {
            super();
            this.totalprice = price;
            this.orderstatus = status;
        }
        // Relationships
        @ManyToOne
        @JoinColumn(name = "customerid", nullable = false)
        @JsonIgnoreProperties({"transaction","wishlist","cart","order", "registration", "username", "email", "phonenumber", "dateofbirth","balance"})
        private CustomerEntity customer;

        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
        @JsonIgnoreProperties({"order", "orderItems", "wishlists"}) // Prevent recursion in both `order` and `orderItems`
        private List<OrderItemEntity> orderItems;



        public int getOrderid() {
            return orderid;
        }

        public void calculateTotalPrice(){
            this.totalprice = orderItems.stream()
                    .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                    .sum();
        }
        public double getTotalprice() {
            return totalprice;
        }


        public void setTotalprice(double totalprice) {
            this.totalprice = totalprice;
        }

        public String getOrderstatus() {
            return orderstatus;
        }

        public void setOrderstatus(String orderstatus) {
            this.orderstatus = orderstatus;
        }

        public List<OrderItemEntity> getOrderItems() {
            return orderItems;
        }

        public void setOrderItems(List<OrderItemEntity> orderItems) {
            this.orderItems = orderItems;
            calculateTotalPrice();
        }

        public CustomerEntity getCustomer() {
            return customer;
        }

        public void setCustomer(CustomerEntity customer) {
            this.customer = customer;
        }
    }
