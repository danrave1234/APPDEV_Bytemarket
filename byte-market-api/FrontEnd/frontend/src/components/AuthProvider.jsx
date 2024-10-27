import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userid, setUserId] = useState(null);

    useEffect(() => {
        // Retrieve token and userId from localStorage on component mount
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token) setIsLoggedIn(true);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    const login = (userId, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); // Store userId
        setIsLoggedIn(true);
        setUserId(userId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Clear userId on logout
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userid, setUserId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
