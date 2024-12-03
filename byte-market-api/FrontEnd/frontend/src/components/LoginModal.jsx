import { useState } from 'react';
import { useAuth } from './AuthProvider.jsx';
import './LoginModal.css';

const LoginModal = ({ show, closeModal, openModalSignUp }) => {
    const { login } = useAuth();
    const [loginData, setLoginData] = useState({ username: '', password: '', userType: 'customer' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(loginData.username, loginData.password, loginData.userType);
            closeModal();
        } catch (error) {
            setErrorMessage(error.message || 'Login failed. Please check your credentials.');
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
