import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ show, closeModal }) => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/customer/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginData.username,
                password: loginData.password
            }),
        })
            .then((response) => {
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Login successful:', data);
                closeModal();
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                setErrorMessage("Login failed. Please check your credentials.");
            });
    };


    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="close-button" onClick={closeModal}>X</button>
                <h2>Login | ByteMarket</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
