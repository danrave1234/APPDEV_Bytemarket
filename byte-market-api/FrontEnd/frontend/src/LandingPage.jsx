import { useEffect, useState } from 'react';
import './styles/LandingPage.css';
import logoNiAndri from './assets/logoNiAndri.png';
import ph1 from './assets/placeholderDan.png';
import ph2 from './assets/placeholder2.png';
import ph3 from './assets/placeholder3.png';
import PageLayout from './components/Layout.jsx';
import { useAuth } from './components/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [slideIndex, setSlideIndex] = useState(0);
    const { userid, role } = useAuth();
    const navigate = useNavigate();

    const slides = [
        { src: ph1, alt: "Placeholder 1" },
        { src: ph2, alt: "Placeholder 2" },
        { src: ph3, alt: "Placeholder 3" },
        { src: logoNiAndri, alt: "Logo Ni Andri" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000); // 7 seconds between slides
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    const prevSlide = () => setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    const goToSlide = (index) => setSlideIndex(index);

    console.log("User ID:", userid);
    console.log("User ROLE:", role);

    return (
        <PageLayout>
            <div className="container">
                <div className="slideshow-container">
                    <button className="previous" onClick={prevSlide}>‹</button>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${slideIndex === index ? "active" : ""}`}
                            style={{
                                backgroundImage: `url(${slide.src})`,
                            }}
                            aria-label={slide.alt}
                        />
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
                    {["Danrave Keh", "Vincent Pacaña", "Andre Apas", "Judiel Oppura", "Josemar Pajares", "Sir Busico"].map((name, index) => (
                        <div className="grid-item" key={index}>{name}</div>
                    ))}
                    {Array(6).fill("Pic/prgraph Placeholders").map((text, index) => (
                        <div key={index} className="grid-item waw-item">{text}</div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}

export default LandingPage;
