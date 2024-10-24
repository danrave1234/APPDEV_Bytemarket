import React, { useState, useEffect } from 'react';
import './SignUpModal.css';

const SignUpModal = ({ show, closeModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    email: '',
    phonenumber: '',
    address: '',
    dateofbirth: ''
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (show) {
      setStep(1); // Reset to step 1 every time the modal is opened
      setErrorMessage(''); // Clear error message when modal opens
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = {
      username: formData.username,
      password: formData.password,
      fullname: formData.fullname,
      email: formData.email,
      phonenumber: formData.phonenumber,
      address: formData.address,
      dateofbirth: formData.dateofbirth,
      balance: 0,
      role: "Customer"
    };

    fetch('http://localhost:8080/api/customer/addCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Customer added successfully:', data);
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding customer:', error);
          setErrorMessage("Registration failed. Please try again.");
        });
  };


  const handleNextStep = () => {
    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill in both the username and password to proceed.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }
    setErrorMessage(''); // Clear any previous error message
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1); // Go back to the first step (username/password)
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!show) {
    return null;
  }

  return (
      <div className="modal-overlay">
        <div className="modal-box">
          {/* Back Arrow */}
          {step === 2 && (
              <button className="back-arrow" onClick={handleBackStep}>
                ←
              </button>
          )}

          {/* Close Button (X) */}
          <button className="close-button" onClick={closeModal}>X</button>

          <h2>Sign Up</h2>
          {step === 1 ? (
              <form>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <div className="show-password">
                  <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={toggleShowPassword}
                  />
                  <label>Show Password</label>
                </div>

                {/* Next button */}
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="next-button"
                >
                  Next
                </button>

                {/* Display error message if inputs are incomplete */}
                {errorMessage && (
                    <p className="error-message">
                      {errorMessage}
                    </p>
                )}
              </form>
          ) : (
              <form onSubmit={handleSubmit}>
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
          )}
        </div>
      </div>
  );
};

export default SignUpModal;
