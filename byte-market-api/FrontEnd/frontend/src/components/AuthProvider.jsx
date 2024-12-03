import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userid, setUserid] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsLoggedIn(true);

                setUserid(decoded.userId);
                setRole(decoded.role);
            } catch (error) {
                console.error('Invalid token:', error);
                logout(); // Clear the invalid token.
            }
        }
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
                console.log("Response Data: ",data);
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setUserid(data.userId);
                setRole(data.role);
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
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userid, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
