import { useState } from 'react';
import { useAuth } from './AuthProvider.jsx';
import './LoginModal.css';

const LoginModalSeller = ({ show, closeModal, toggleDropdown }) => {
    const { setIsLoggedIn, setUserId, setRole } = useAuth();
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/seller/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userid);
            localStorage.setItem('role', data.role);

            setIsLoggedIn(true);
            setUserId(data.userid);
            setRole(data.role);
            toggleDropdown();
            closeModal();
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage("Login failed. Please check your credentials.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="close-button" onClick={closeModal}>X</button>
                <h2>LOGIN | ByteMarket Seller</h2>
                <form onSubmit={handleLogin}>
                    <input className="credential-fields"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <input className="credential-fields"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="submit-button">Login</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginModalSeller;
