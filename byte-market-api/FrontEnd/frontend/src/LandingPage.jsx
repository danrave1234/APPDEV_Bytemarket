import {useEffect, useState} from 'react';
import './styles/LandingPage.css';
import logoNiAndri from './assets/logoNiAndri.png';
import ph1 from './assets/placeholderDan.png';
import ph2 from './assets/placeholder2.png';
import ph3 from './assets/placeholder3.png';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function LandingPage() {
    const [slideIndex, setSlideIndex] = useState(0);
    const {userid, role} = useAuth();

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
    console.log("User ID: ", userid);
    console.log("User ROLE: ", role);

    return (
        <>
            <PageLayout>
                <div className="container">
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
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>
                        <h1>WAW</h1>

                    </div>
                </div>
            </PageLayout>
        </>
    );
}

export default LandingPage;
