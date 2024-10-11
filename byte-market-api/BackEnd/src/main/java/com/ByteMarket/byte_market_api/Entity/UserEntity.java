package com.ByteMarket.byte_market_api.Entity;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "tblUser")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;
    private String username;
    private String password;
    private String email;
    private String phonenumber;
    private String address; //Kuan rani kanang like street, barangay
    private String city; //Para ma recommend based sa lugar and easy to extract if e usa sa address, lisod
    private String state;
    private String country;
    private LocalDate dateofbirth; //LocalDate datatype

    public UserEntity() {
        super();
    }

    public UserEntity(String username, String password, String email, String phonenumber, String address, String city, String state, String country, LocalDate dateofbirth) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phonenumber = phonenumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.dateofbirth = dateofbirth;
    }

    public int getUserid() {
        return userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public LocalDate getDateofbirth() {
        return dateofbirth;
    }

    public void setDateofbirth(LocalDate dateofbirth) {
        this.dateofbirth = dateofbirth;
    }
}
