import React, { useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import SignUpModal from './SignUpModal.jsx';
import LoginModal from './LoginModal.jsx';
import VincentLogo from '../assets/VincentLogo3.png';
import profileIcon from '../assets/profileIcon.png';
import walletLogoBlack from '../assets/walletLogo-black.png';
import arrow from '../assets/Arrow.png';
import searchIcon from '../assets/searchIcon.png';
import './Layout.css';
import { useAuth } from "./AuthProvider.jsx";
import LoginModalSeller from "./LoginModalSeller.jsx";
import LoginModalAdmin from "./LoginModalAdmin.jsx";
import SignUpModalSeller from "./SignUpModalSeller.jsx";
import WalletModal from "./WalletModal.jsx";

function PageLayout({ children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModalSignUp, setShowModalSignUp] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [showModalSignUpSeller, setShowModalSignUpSeller] = useState(false);
    const [showModalLoginSeller, setShowModalLoginSeller] = useState(false);
    const [showModalLoginAdmin, setShowModalLoginAdmin] = useState(false);
    const [showModalWallet, setShowModalWallet] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const navigate = useNavigate();
    const { isLoggedIn, logout, role, name } = useAuth(); // Assuming `name` is available in useAuth

    const openModalWallet = () => {
        setShowModalWallet(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalWallet = () => {
        setShowModalWallet(false);
        document.body.style.overflow = 'auto';
    };

    const openModalSignUp = () => {
        setShowModalSignUp(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalSignUp = () => {
        setShowModalSignUp(false);
        document.body.style.overflow = 'auto';
    };

    const openModalLogin = () => {
        setShowModalLogin(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalLogin = () => {
        setShowModalLogin(false);
        document.body.style.overflow = 'auto';
    };

    const openModalSignUpSeller = () => {
        setShowModalSignUpSeller(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalSignUpSeller = () => {
        setShowModalSignUpSeller(false);
        document.body.style.overflow = 'auto';
    };

    const openModalLoginSeller = () => {
        setShowModalLoginSeller(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalLoginSeller = () => {
        setShowModalLoginSeller(false);
        document.body.style.overflow = 'auto';
    };

    const openModalLoginAdmin = () => {
        setShowModalLoginAdmin(true);
        document.body.style.overflow = 'hidden';
    };
    const closeModalLoginAdmin = () => {
        setShowModalLoginAdmin(false);
        document.body.style.overflow = 'auto';
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setShowDropdown(false);
    };
    const handleHome = () => {
        navigate("/");
        setShowDropdown(false);
    };
    const handleProfile = () => {
        navigate('/customer/userProfile');
    }
    const handleHistory = () => {
        navigate('/customer/orderHistory');
    }
    const handleStore = () => {
        navigate('/seller/store');
    }
    const handleAdminDashboard = () => {
        navigate('/admin/dashboard');
    }
    const handleCheckOut = () => {
        navigate('/customer/CheckOut');
    }
    const handleAddToCart = () => {
        navigate('/customer/addToCart');
    }
    const handleWishlist = () => {
        navigate('/customer/wishlists');
    }

    // Greeting Logic
    const getGreetingMessage = () => {
        if (role === 'Admin') {
            return `Greetings, ${name}!`;
        } else if (role === 'Customer') {
            return `Welcome, ${name}!`;
        } else if (role === 'Seller') {
            return `It's sales time, ${name}!`;
        }
        return '';
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/productlisting?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };
    const clearSearch = () => {
        setSearchQuery('');
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('search');
        navigate(`?${queryParams.toString()}`);
    };
    return (
        <>
            <div className="containerLayout1">
                <header className="header">
                    <div className="logoAndName">
                        <a onClick={handleHome}><img src={VincentLogo} alt="ByteMarket Logo" className="logo" /></a>
                    </div>
                    {isLoggedIn && (
                        <div className="greeting-message">{getGreetingMessage()}</div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {isLoggedIn && (
                            <div className="wallet-button">
                                <img src={walletLogoBlack} alt="Wallet" onClick={openModalWallet} />
                            </div>
                        )}
                        <div className="profileBar" onClick={toggleDropdown}>
                            <img src={arrow} alt="Arrow" className="profileArrow" />
                            <img src={profileIcon} alt="Profile Icon" className="profileIcon" />
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="dropdown">
                            <ul>
                                {isLoggedIn ? (
                                    <>
                                        <li className="dropdownItem" onClick={handleProfile}>Profile</li>
                                        {role === 'Customer' && (
                                            <>
                                                <li className="dropdownItem" onClick={handleWishlist}>Wishlist</li>
                                                <li className="dropdownItem" onClick={handleAddToCart}>Cart</li>
                                                <li className="dropdownItem" onClick={handleHistory}>Order History</li>
                                            </>
                                        )}
                                        {role === 'Seller' && (
                                            <>
                                                <li className="dropdownItem" onClick={handleStore}>Store</li>
                                                <li className="dropdownItem" onClick={handleCheckOut}>Orders</li>
                                            </>
                                        )}
                                        {role === 'Admin' && (
                                            <li className="dropdownItem" onClick={handleAdminDashboard}>Dashboard</li>
                                        )}
                                        <li className="dropdownItem" onClick={handleLogout}>Logout</li>
                                    </>
                                ) : (
                                    <>
                                        <li className="dropdownItemLabel">Customer</li>
                                        <li className="dropdownItem" onClick={openModalSignUp}>Sign Up</li>
                                        <li className="dropdownItem" onClick={openModalLogin}>Login</li>
                                        <li className="dropdownItemLabel">Seller</li>
                                        <li className="dropdownItem" onClick={openModalSignUpSeller}>Sign Up</li>
                                        <li className="dropdownItem" onClick={openModalLoginSeller}>Login</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </header>
            </div>
            <SignUpModal show={showModalSignUp} closeModal={closeModalSignUp} toggleDropdown={toggleDropdown}/>
            <LoginModal show={showModalLogin} closeModal={closeModalLogin} toggleDropdown={toggleDropdown} />

            <div className="containerLayout2">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="searchBar"
                    />
                    <button className="clearButton" onClick={clearSearch}> X</button>
                    <button className="searchButton" onClick={handleSearch}>
                        <img src={searchIcon} alt="Search Icon" className="searchIcon"/>
                    </button>
                </div>
            </div>
            <main>{children}</main>

            <footer>
                <div className="footer-div">
                    <div>
                        <img src={VincentLogo} alt="ByteMarket Logo" className="footer-logo"/>
                        <p>Your one-stop marketplace for quality products. Discover, shop, and enjoy fast, secure
                            transactions.</p>
                    </div>
                    <div style={{flex: 1, minWidth: "200px", padding: "10px"}}>
                        <h4>Quick Links</h4>
                        <ul>
                        <li><a onClick={handleHome}>Home</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Customer Service</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Seller Resources</h4>
                        <ul>
                            <li><a onClick={openModalLoginSeller}>Seller Login</a></li>
                            <li><a onClick={openModalSignUpSeller}>Become a Seller</a></li>
                            <li><a href="#">Seller Policies</a></li>
                            <li><a href="#">Account Support</a></li>
                        </ul>
                        </div>
                    <SignUpModalSeller show={showModalSignUpSeller} closeModal={closeModalSignUpSeller} toggleDropdown={toggleDropdown} />
                    <LoginModalSeller show={showModalLoginSeller} closeModal={closeModalLoginSeller} toggleDropdown={toggleDropdown} />
                    <WalletModal show={showModalWallet} closeModal={closeModalWallet} />
                    <div>
                        <h4>Admin</h4>
                        <ul>
                            <li><a onClick={openModalLoginAdmin}>Admin Login</a></li>
                        </ul>
                    </div>
                    <LoginModalAdmin show={showModalLoginAdmin} closeModal={closeModalLoginAdmin} toggleDropdown={toggleDropdown} />
                </div>
            </footer>
        </>
    );
}

export default PageLayout;
