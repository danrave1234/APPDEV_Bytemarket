import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false  );
    const [userid, setUserId] = useState(localStorage.getItem('userId'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    console.log("Role: ",role)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('role');
        const storedName = localStorage.getItem('name'); // Retrieve name from localStorage
        if (token) setIsLoggedIn(true);
        if (storedUserId) setUserId(storedUserId);
        if (storedRole) setRole(storedRole);
        if (storedName) setName(storedName); // Set name in state
    }, []);

    const login = (userId, token, userRole) => {
        console.log("userId:", userId);
        console.log("token:", token);
        console.log("role:", userRole);
        console.log("name:", userName);

        if (token && userId && userRole) { // Only save if defined
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", userRole);
            localStorage.setItem("name", userName); // Store name in localStorage
            setIsLoggedIn(true);
            setUserId(userId);
            setRole(userRole);
            setName(userName); // Set name in state
        } else {
            console.warn("Invalid login details provided.");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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
