package com.ByteMarket.byte_market_api.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblUser")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int UserId;
    private String UserName;
    private String Password;
    private String Email;
    private String PhoneNumber;
    private String Address; //Kuan rani kanang like street, barangay
    private String City; //Para ma recommend based sa lugar and easy to extract if e usa sa address, lisod
    private String State;
    private String Country;

    public UserEntity() {
        super();
    }
    public UserEntity(String UserName, String Password) {
        super();
        this.UserName = UserName;
        this.Password = Password;
    }

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String city) {
        City = city;
    }

    public String getState() {
        return State;
    }

    public void setState(String state) {
        State = state;
    }

    public String getCountry() {
        return Country;
    }

    public void setCountry(String country) {
        Country = country;
    }

}
