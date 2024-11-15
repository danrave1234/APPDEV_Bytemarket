import React, { useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import SignUpModal from './SignUpModal.jsx';
import LoginModal from './LoginModal.jsx';
import VincentLogo from '../assets/VincentLogo3.png';
import profileIcon from '../assets/profileIcon.png';
import walletLogoBlack from '../assets/walletLogo-black.png';
import arrow from '../assets/Arrow.png';
import searchIcon from '../assets/searchiconwhite2.png';
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
    const { isLoggedIn, logout, role, name } = useAuth();


    // All modal handlers remain the same...
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

    // Navigation handlers remain the same...
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
        setShowDropdown(false);
    }
    const handleHistory = () => {
        navigate('/customer/orderHistory');
        setShowDropdown(false);
    }
    const handleStore = () => {
        navigate('/seller/store');
        setShowDropdown(false);
    }
    const handleAdminDashboard = () => {
        navigate('/admin/dashboard');
        setShowDropdown(false);
    }
    const handleCheckOut = () => {
        navigate('/seller/CheckOut');
        setShowDropdown(false);
    }
    const handleAddToCart = () => {
        navigate('/customer/addToCart');
        setShowDropdown(false);
    }
    const handleWishlist = () => {
        navigate('/customer/wishlists');
        setShowDropdown(false);
    }

    /*in-line greeting message*/
    const getGreetingMessage = () => {
        if (role === 'Admin') {
            return `Greetings, Admin!`;
        } else if (role === 'Customer') {
            return `Welcome, Valued Customer!`;
        } else if (role === 'Seller') {
            return `It's sales time, Seller!`;
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
                    <div className="header-left">
                        <div className="logoAndName">
                            <a onClick={handleHome}><img src={VincentLogo} alt="ByteMarket Logo" className="logo" /></a>
                        </div>
                        {isLoggedIn && (
                            <div className="greeting-message">{getGreetingMessage()}</div>
                        )}
                    </div>

                    <div className="search-container">
                        <div className="searchBar">
                            <input
                                type="text"
                                placeholder="Search products here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="clearButton"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                            <button
                                className="searchButton"
                                onClick={handleSearch}
                                aria-label="Search"
                            >
                                <img
                                    src={searchIcon}
                                    alt="Search"
                                    className="searchIcon"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="header-right">
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
                                        <li className="dropdownItem" onClick={handleProfile}><b>Profile</b></li>
                                        <li className="dropdownDivider"></li>
                                        {role === 'Customer' && (
                                            <>
                                                <li className="dropdownItem" onClick={handleWishlist}><b>Wishlists</b></li>
                                                <li className="dropdownItem" onClick={handleAddToCart}><b>Cart</b></li>
                                                <li className="dropdownItem" onClick={handleHistory}><b>Order History</b></li>
                                                <li className="dropdownDivider"></li>
                                            </>
                                        )}
                                        {role === 'Seller' && (
                                            <>
                                                <li className="dropdownItem" onClick={handleStore}><b>Store</b></li>
                                                <li className="dropdownItem" onClick={handleCheckOut}><b>Orders</b></li>
                                                <li className="dropdownDivider"></li>
                                            </>
                                        )}
                                        {role === 'Admin' && (
                                            <li className="dropdownItem" onClick={handleAdminDashboard}>Dashboard</li>
                                        )}
                                        <li className="dropdownItem" onClick={handleLogout}><b>Log out</b></li>
                                    </>
                                ) : (
                                    <>
                                        <li className="dropdownItemLabel">Customer</li>
                                        <li className="dropdownItem" onClick={openModalSignUp}><b>Sign Up</b></li>
                                        <li className="dropdownItem" onClick={openModalLogin}><b>Log in</b></li>
                                        <li className="dropdownDivider"></li>
                                        <li className="dropdownItemLabel">Seller</li>
                                        <li className="dropdownItem" onClick={openModalSignUpSeller}><b>Sign Up</b></li>
                                        <li className="dropdownItem" onClick={openModalLoginSeller}><b>Log in</b></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </header>
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
                            <li><a onClick={handleStore}>Shop</a></li>
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
                    <div>
                        <h4>Admin</h4>
                        <ul>
                            <li><a onClick={openModalLoginAdmin}>Admin Login</a></li>
                        </ul>
                    </div>
                </div>
            </footer>

            <SignUpModal show={showModalSignUp} closeModal={closeModalSignUp} toggleDropdown={toggleDropdown}/>
            <LoginModal show={showModalLogin} closeModal={closeModalLogin} toggleDropdown={toggleDropdown} />
            <SignUpModalSeller show={showModalSignUpSeller} closeModal={closeModalSignUpSeller} toggleDropdown={toggleDropdown} />
            <LoginModalSeller show={showModalLoginSeller} closeModal={closeModalLoginSeller} toggleDropdown={toggleDropdown} />
            <LoginModalAdmin show={showModalLoginAdmin} closeModal={closeModalLoginAdmin} toggleDropdown={toggleDropdown} />
            <WalletModal show={showModalWallet} closeModal={closeModalWallet} />
        </>
    );
}

export default PageLayout;