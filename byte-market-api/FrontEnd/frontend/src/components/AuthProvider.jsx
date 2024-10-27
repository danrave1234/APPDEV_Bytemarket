import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userid, setUserId] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Retrieve token and userId from localStorage on component mount
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('role');
        if (token) setIsLoggedIn(true);
        if (storedUserId) setUserId(storedUserId);
        if (storedRole) setRole(storedRole);
    }, []);

    const login = (userId, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); // Store userId
        localStorage.setItem('role', token);
        setIsLoggedIn(true);
        setUserId(userId);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Clear userId on logout
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserId(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userid, setUserId, role, setRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
