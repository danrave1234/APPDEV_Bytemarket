import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userid, setUserid] = useState(null);
    const [role, setRole] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsLoggedIn(true);
                setUserid(decoded.userId);
                setRole(decoded.role);
                setSenderId(decoded.userId); // senderId is always the logged in user
            } catch (error) {
                console.error('Invalid token:', error);
                logout(); // Clear the invalid token.
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password, userType) => {
        const endpointMap = {
            customer: 'http://localhost:8080/api/customer/auth/login',
            seller: 'http://localhost:8080/api/seller/auth/login',
            admin: 'http://localhost:8080/api/admin/auth/login',
        };

        const endpoint = endpointMap[userType];

        if (!endpoint) {
            throw new Error('Invalid user type');
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json(); // Handle JSON response
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setUserid(data.userId);
                setRole(data.role);

                if (data.role === 'Seller') {
                    setReceiverId(data.userId); // seller is the receiver
                    setSenderId(null); // no senderId initially, will be set when customer interacts
                } else if (data.role === 'Customer') {
                    setReceiverId(null); // receiver will be set when interacting with a seller
                    setSenderId(data.userId); // customer is the sender
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        setIsLoggedIn(false);
        setUserid(null);
        setRole(null);
        setReceiverId(null);
        setSenderId(null);
        setConversationId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userid, role, receiverId, setReceiverId, senderId, setSenderId, conversationId, setConversationId, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);