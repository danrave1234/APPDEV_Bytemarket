import React, { useState } from 'react';
import {Route, Routes, useNavigate } from "react-router-dom";
import SignUpModal from './SignUpModal.jsx';
import LoginModal from './LoginModal.jsx';
import VincentLogo from '../assets/VincentLogo3.png';
import profileIcon from '../assets/profileIcon.png';
import arrow from '../assets/Arrow.png';
import searchIcon from '../assets/searchIcon.png';
import './Layout.css';
import {useAuth} from "./AuthProvider.jsx";

function PageLayout({ children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModalSignUp, setShowModalSignUp] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const openModalSignUp = () => setShowModalSignUp(true);
    const closeModalSignUp = () => setShowModalSignUp(false);
    const openModalLogin = () => setShowModalLogin(true);
    const closeModalLogin = () => setShowModalLogin(false);
    const navigate = useNavigate(); // Initialize navigate using the hook
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };
    const handleProfile = () => {
        navigate('/customer/userProfile');
    }
    const handleHistory = () => {
        navigate('/customer/orderHistory');
    }

    return (
        <>
            <div className="containerLayout1">
                <header className="header">
                    <div className="logoAndName">
                        <img src={VincentLogo} alt="ByteMarket Logo" className="logo" />
                    </div>
                    <div className="profileBar" onClick={toggleDropdown}>
                        <img src={arrow} alt="Arrow" className="profileArrow" />
                        <img src={profileIcon} alt="Profile Icon" className="profileIcon" />
                    </div>
                    {showDropdown && (
                        <div className="dropdown">
                            <ul>
                                {isLoggedIn ? (
                                    <>
                                        <li className="dropdownItem" onClick={handleProfile}>Profile</li>
                                        <li className="dropdownItem">Wishlist</li>
                                        <li className="dropdownItem">Cart</li>
                                        <li className="dropdownItem" onClick={handleHistory}>Order History</li>
                                        <li className="dropdownItem" onClick={handleLogout}>Logout</li>
                                    </>
                                ) : (
                                    <>
                                        <li className="dropdownItem" onClick={openModalSignUp}>Sign Up</li>
                                        <li className="dropdownItem" onClick={openModalLogin}>Login</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </header>
            </div>
            <SignUpModal show={showModalSignUp} closeModal={closeModalSignUp} />
            <LoginModal show={showModalLogin} closeModal={closeModalLogin} />

            <div className="containerLayout2">
                <div className="searchBar">
                    <input type="text" placeholder="Search..." className="searchBar" />
                    <button className="searchButton">
                        <img src={searchIcon} alt="Search Icon" className="searchIcon" />
                    </button>
                </div>
            </div>
            <main>{children}</main>

            <footer>
                <div>
                    <div>
                        <img src={VincentLogo} alt="ByteMarket Logo" className="footer-logo" />
                        <p>Your one-stop marketplace for quality products. Discover, shop, and enjoy fast, secure transactions.</p>
                    </div>

                    <div style={{ flex: 1, minWidth: "200px", padding: "10px" }}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Shop</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Customer Service</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Order Tracking</a></li>
                            <li><a href="#">Shipping & Returns</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Seller Resources</h4>
                        <ul>
                            <li><a href="#">Seller Login</a></li>
                            <li><a href="#">Become a Seller</a></li>
                            <li><a href="#">Seller Policies</a></li>
                            <li><a href="#">Account Support</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default PageLayout;
