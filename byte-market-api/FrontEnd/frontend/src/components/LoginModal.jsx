import { useState } from 'react';
import { useAuth } from './AuthProvider.jsx';
import './LoginModal.css';

const LoginModal = ({ show, closeModal, openModalSignUp }) => {
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
            const response = await fetch('http://localhost:8080/api/customer/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed. Please check your credentials.");
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userid);
            localStorage.setItem('role', data.role);

            setIsLoggedIn(true);
            setUserId(data.userid);
            setRole(data.role);
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
                <h2>LOGIN | ByteMarket</h2>
                <form onSubmit={handleLogin}>
                    <input
                        className="credential-fields"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="credential-fields"
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
                <p className="signup-text">
                    Don't have an account yet? <button className="signup-button" onClick={openModalSignUp}>Sign up here</button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
