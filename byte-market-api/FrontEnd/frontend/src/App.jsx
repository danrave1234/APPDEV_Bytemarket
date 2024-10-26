import {useEffect, useState} from 'react';
import './App.css';
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


// Import additional images for the slideshow

function App() {
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
                    <button className="previous" onClick={prevSlide}/>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${slideIndex === index ? "active" : ""}`}
                            style={{display: slideIndex === index ? "block" : "none"}}
                        >
                            {slide}
                        </div>
                    ))}
                    <button className="next" onClick={nextSlide}/>
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
                <p>GG</p>
                <h2>are you a seller? <b>Click here</b>
                </h2>
            </footer>
            {/*<style jsx>{`*/}
            {/*  .grid-container {*/}
            {/*    display: grid;*/}
            {/*    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));*/}
            {/*    gap: 20px;*/}
            {/*    justify-items: center;*/}
            {/*    margin: 20px 0;*/}
            {/*    padding: 20px;*/}
            {/*  }*/}

            {/*  .grid-item {*/}
            {/*    background-color: #f0f0f0;*/}
            {/*    padding: 20px;*/}
            {/*    text-align: center;*/}
            {/*    font-size: 1.2em;*/}
            {/*    border-radius: 8px;*/}
            {/*    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);*/}
            {/*    transition: transform 0.3s ease, box-shadow 0.3s ease;*/}
            {/*  }*/}

            {/*  .grid-item:hover {*/}
            {/*    transform: translateY(-10px);*/}
            {/*    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);*/}
            {/*    background: lightblue;*/}
            {/*  }*/}

            {/*  .searchBar {*/}
            {/*    display: flex;*/}
            {/*    justify-content: center;*/}
            {/*    margin: 20px;*/}
            {/*  }*/}

            {/*  .container1, .container2, .container3 {*/}
            {/*    color: #000000;*/}
            {/*    padding: 20px;*/}
            {/*  }*/}

            {/*  body {*/}
            {/*    font-family: Helvetica, sans-serif;*/}
            {/*  }*/}

            {/*  h1 {*/}
            {/*    text-align: center;*/}
            {/*    font-size: 2em;*/}
            {/*    color: #333;*/}
            {/*  }*/}
            {/*`}</style>*/}
        </>
    );
}

export default App;
