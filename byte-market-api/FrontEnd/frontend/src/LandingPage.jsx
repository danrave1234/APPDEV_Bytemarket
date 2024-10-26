import {useEffect, useState} from 'react';
import './styles/LandingPage.css';
import SignUpModal from "./components/SignUpModal.jsx";
import LoginModal from "./components/LoginModal.jsx";
import VincentLogo from './assets/VincentLogo3.png';
import profileIcon from './assets/profileIcon.png';
import logoNiAndri from './assets/logoNiAndri.png';
import arrow from './assets/Arrow.png';
import searchIcon from './assets/searchIcon.png';
import ph1 from './assets/placeholderDan.png';
import ph2 from './assets/placeholder2.png';
import ph3 from './assets/placeholder3.png';

function LandingPage() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [showModalSignUp, setShowModalSignUp] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);

    const slides = [       //img size 1450x200
        <img src={ph1} alt="logoNiAndri" />,
        <img src={ph2} alt="Image 2" />,
        <img src={ph3} alt="Image 3" />,
        <img src={logoNiAndri} alt="LogoNiAndri" />
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds interval

        return () => clearInterval(interval); // Cleanup on unmount
    }, [slides.length]);

    const nextSlide = () => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setSlideIndex(index);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const openModalSignUp = () => setShowModalSignUp(true);   // Open modal for Sign up
    const closeModalSignUp = () => setShowModalSignUp(false); // Close modal for Sign up
    const openModalLogin = () => setShowModalLogin(true);   // Open modal for Sign up
    const closeModalLogin = () => setShowModalLogin(false); // Close modal for Sign up
    return (
        <>
            <div className="container1">
                <header className="header">
                    <div className="logoAndName">
                        <img src={VincentLogo} alt="ByteMarket Logo" className="logo"/>
                    </div>
                    <div className="profileBar" onClick={toggleDropdown}>
                        <img src={arrow} alt="Arrow" className="profileArrow"/>
                        <img src={profileIcon} alt="Profile Icon" className="profileIcon"/>
                    </div>
                    {showDropdown && (
                        <div className="dropdown">
                            <ul>
                                <li className="dropdownItem" onClick={openModalSignUp}>Sign Up</li>
                                <li className="dropdownItem" onClick={openModalLogin}>Login</li>
                            </ul>
                        </div>
                    )}
                </header>
            </div>

            <SignUpModal show={showModalSignUp} closeModal={closeModalSignUp}/>
            <LoginModal show={showModalLogin} closeModal={closeModalLogin}/>

            <div className="container2">
                <div className="searchBar">
                    <input type="text" placeholder="Search..." className="searchBar"/>
                    <button className="searchButton">
                        <img src={searchIcon} alt="Search Icon" className="searchIcon"/>
                    </button>
                </div>
            </div>
            <div className="container3">
                <div className="slideshow-container">
                    <button className="previous" onClick={prevSlide}>‹</button>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${slideIndex === index ? "active" : ""}`}
                            style={{display: slideIndex === index ? "block" : "none"}}
                        >
                            {slide}
                        </div>
                    ))}
                    <button className="next" onClick={nextSlide}>›</button>
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${slideIndex === index ? "active" : ""}`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}

                    </div>
                </div>

                <div className="grid-container">
                    <div className="grid-item">Danrave Keh</div>
                    <div className="grid-item">Vincent Pacaña</div>
                    <div className="grid-item">Andre Apas</div>
                    <div className="grid-item">Judiel Oppura</div>
                    <div className="grid-item">Josemar Pajares</div>
                    <div className="grid-item">Sir Busico</div>
                </div>
            </div>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>
            <h1>Waw</h1>


            <footer>
                <div>
                    <div>
                        <img src={VincentLogo} alt="ByteMarket Logo" className="footer-logo"/>
                        <p>Your one-stop marketplace for quality products. Discover, shop, and enjoy fast, secure
                            transactions.</p>
                    </div>

                    <div style={{flex: 1, minWidth: "200px", padding: "10px"}}>
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

export default LandingPage;
