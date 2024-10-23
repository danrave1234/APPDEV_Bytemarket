import React, { useState } from 'react';
import './SignUpModal.css';

const SignUpModal = ({ show, closeModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phonenumber: '',
    address: '',
    dateofbirth: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload for the POST request
    const customerData = {
      username: formData.username,
      password: formData.password,
      fullname: formData.fullname,
      email: formData.email,
      phonenumber: formData.phonenumber,
      address: formData.address,
      dateofbirth: formData.dateofbirth, // ensure this is in 'YYYY-MM-DD' format
      balance: 0 // Assuming a new customer starts with zero balance
    };

    // Send the form data to the Spring Boot API
    fetch('http://localhost:8080/api/customer/addCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })
        .then((response) => response.json())
        .then((data) => {
          console.log('Customer added successfully:', data);
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding customer:', error);
        });
  };

  if (!show) {
    return null;
  }

  return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="phonenumber"
                placeholder="Phone Number"
                value={formData.phonenumber}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
            />
            <input
                type="date"
                name="dateofbirth"
                value={formData.dateofbirth}
                onChange={handleChange}
                required
            />
            <button type="submit">Submit</button>
          </form>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
  );
};

export default SignUpModal;
