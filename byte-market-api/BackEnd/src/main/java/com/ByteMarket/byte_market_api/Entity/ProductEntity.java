package com.ByteMarket.byte_market_api.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.sql.Blob;
import java.util.List;
//Andri
@Entity
@Table(name = "tblproduct")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productid;
    private String productname;
    private double price;
    private int quantity;
    private String category;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    public ProductEntity() {
        super();
    }
    public ProductEntity(String productname, double price, int quantity, String category, String description) {
        super();
        this.productname = productname;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.description = description;
    }

    // Relationships
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnoreProperties({"registration", "products", "email", "phonenumber", "dateofbirth"}) // Ignore all other seller details
    private SellerEntity seller;

    @OneToMany(mappedBy = "product", orphanRemoval = true)
    @JsonIgnoreProperties({"product"})
    private List<CartEntity> carts;

    @ManyToMany(mappedBy = "wishlistProducts", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"wishlistProducts", "carts", "wishlists"})
    private List<WishlistEntity> wishlists;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RatingEntity> ratings;

    @OneToMany(mappedBy = "product")
    private List<OrderItemEntity> orderItems;

    @OneToMany(mappedBy = "product")
    @JsonIgnoreProperties({"inventory", "carts", "wishlists", "ratings"})
    private List<InventoryEntity> inventory;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getProductid() {
        return productid;
    }
    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public SellerEntity getSeller() {
        return seller;
    }

    public void setSeller(SellerEntity seller) {
        this.seller = seller;
    }

    public List<CartEntity> getCarts() {
        return carts;
    }

    public void setCarts(List<CartEntity> carts) {
        this.carts = carts;
    }

    public List<WishlistEntity> getWishlists() {
        return wishlists;
    }

    public void setWishlists(List<WishlistEntity> wishlists) {
        this.wishlists = wishlists;
    }

    public List<RatingEntity> getRatings() {
        return ratings;
    }

    public void setRatings(List<RatingEntity> ratings) {
        this.ratings = ratings;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public List<InventoryEntity> getInventory() {
        return inventory;
    }

    public void setInventory(List<InventoryEntity> inventory) {
        this.inventory = inventory;
    }
}