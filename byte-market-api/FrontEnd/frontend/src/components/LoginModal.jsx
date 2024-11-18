import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider.jsx';
import './LoginModal.css';
import SignUpModal from './SignUpModal';

const LoginModal = ({ show, closeModal, toggleDropdown }) => {
    const { setIsLoggedIn, setUserId, setRole } = useAuth();
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (e.target.className === 'modal-overlay') {
                closeModal();
            }
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        // Adding event listeners
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [closeModal]);

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
                const errorData = await response.json(); // Capture error response if available
                console.error('Error logging in:', errorData.message || 'Unknown error');
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
            toggleDropdown();
            closeModal();
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage("Login failed. Please check your credentials.");
        }
    };

    const openSignUpModal = () => {
        setShowSignUpModal(true);
    };

    const closeSignUpModal = () => {
        setShowSignUpModal(false);
    };

    if (!show) return null;

    return (
        <>
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

                    {/* Sign Up Link */}
                    <div className="sign-up-link">
                        <p><span style={{ color: 'black' }}>Don't have an account? </span>
                            <span
                                onClick={openSignUpModal}  //
                                className="sign-up-text"
                                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Sign up here
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Show SignUpModal when showSignUpModal is true */}
            {showSignUpModal && <SignUpModal show={showSignUpModal} closeModal={closeSignUpModal} />}
        </>
    );
};

export default LoginModal;
