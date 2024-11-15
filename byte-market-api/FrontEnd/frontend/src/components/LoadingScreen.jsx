// LoadingScreen.jsx
import React from 'react';
import PageLayout from "./Layout.jsx";
import { useAuth } from "./AuthProvider.jsx";
import '../styles/LoadingScreen.css';
import logo from '../assets/VincentLogo3.png';

function LoadingScreen() {
    const { userid } = useAuth();

    return (
        <PageLayout>
            <div className="loading-screen">
                <img src={logo} alt="Vincent Logo" className="loading-logo" />
                <h1>LOADING PLEASE WAIT</h1>
                <div className="spinner"></div>
            </div>
        </PageLayout>
    );
}

export default LoadingScreen;
