package com.ByteMarket.byte_market_api.Entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

//Danrave
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Table(name = "tbluser")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;

    private String role; //Customer, Seller, Admin
    @Column(unique = true)
    private String username;
    private String password;
    private String fullname;
    @Column(unique = true)
    private String email;
    private String phonenumber;
    private String address; //Kuan rani kanang like street, barangay
    private LocalDate dateofbirth; //LocalDate datatype
    private LocalDate registration;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] profilepic;


    public UserEntity() {
        super();
    }

    public UserEntity(String role, String username, String password, String email, String phonenumber, String address, String city, LocalDate dateofbirth, LocalDate registration, String fullname, double balance) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phonenumber = phonenumber;
        this.address = address;
        this.dateofbirth = dateofbirth;
        this.registration = registration;
        this.fullname = fullname;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public LocalDate getRegistration() {
        return registration;
    }

    public void setRegistration(LocalDate registration) {
        this.registration = registration;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateofbirth() {
        return dateofbirth;
    }

    public void setDateofbirth(LocalDate dateofbirth) {
        this.dateofbirth = dateofbirth;
    }

    public byte[] getProfilepic() {
        return profilepic;
    }

    public void setProfilepic(byte[] profilepic) {
        this.profilepic = profilepic;
    }
}
