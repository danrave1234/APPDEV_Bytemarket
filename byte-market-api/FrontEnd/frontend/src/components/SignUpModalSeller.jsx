import React, { useState, useEffect } from 'react';
import './SignUpModal.css';

const SignUpModal = ({ show, closeModal, toggleDropdown }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    email: '',
    phonenumber: '',
    address: '',
    dateofbirth: '',
    sellername: '',
    storename: '',
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    if (show) {
      setStep(1);
      setErrorMessage('');
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      updatePasswordValidations(value);
    }
  };

  const updatePasswordValidations = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  };

  const handleNextStep = () => {
    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill in both the username and password to proceed!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }
    if (!Object.values(passwordValidations).every(Boolean)) {
      setErrorMessage('Please ensure all password criteria are met.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sellerData = {
      username: formData.username,
      password: formData.password,
      fullname: formData.fullname,
      email: formData.email,
      phonenumber: formData.phonenumber,
      address: formData.address,
      dateofbirth: formData.dateofbirth,
      sellername: formData.sellername, // Include sellername
      storename: formData.storename,     // Include storename
      balance: 0,
      role: "seller"
    };

    fetch('http://localhost:8080/api/seller/addSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sellerData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Seller added successfully:', data);
      toggleDropdown();
      closeModal();
    })
    .catch((error) => {
      console.error('Error adding seller:', error);
      setErrorMessage("Registration failed. Please try again.");
    });
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!show) {
    return null;
  }

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const formattedToday = today.toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {step === 2 && (
          <button className="back-arrow" onClick={handleBackStep}>
            ←
          </button>
        )}

        <button className="close-button" onClick={closeModal}>X</button>

        <h2>SIGN UP NOW AS OUR SELLER!</h2>
        {step === 1 ? (
          <form>
            <input className="sign-up-credentials"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input className="sign-up-credentials"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input className="sign-up-credentials"
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

            {/* Password Requirements */}
            <div className="password-requirements">
              <p>Password Requirements:</p>
              <p className={passwordValidations.length ? 'valid' : 'invalid'}>
                Minimum 8 characters
              </p>
              <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}>
                At least one uppercase letter
              </p>
              <p className={passwordValidations.number ? 'valid' : 'invalid'}>
                At least one number
              </p>
              <p className={passwordValidations.specialChar ? 'valid' : 'invalid'}>
                At least one special character (@$!%*?&)
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="next-button"
            >
              Next
            </button>

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
              max={formattedToday}
              required
            />
            {/* New fields for seller name and store name */}
            <input
              type="text"
              name="sellername"
              placeholder="Seller Name"
              value={formData.sellername}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="storename"
              placeholder="Store Name"
              value={formData.storename}
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
