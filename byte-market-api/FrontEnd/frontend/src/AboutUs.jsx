import React from 'react';
import PageLayout from './components/Layout.jsx'; // Import the Layout component
import './styles/AboutUs.css'; // Ensure this CSS file has the updated styles
import ProfileAndri from './assets/ProfileAndri.png'; // Adjust the path based on the file's location
import ProfileDan from './assets/ProfileDan.png';
import ProfileJosemar from './assets/ProfileJosemar.png';
import ProfileJudiel from './assets/ProfileJudiel.png';
import ProfileVincent from './assets/ProfileVincent.png';

const founders = [
    {
        name: "Andri Apas",
        title: "Co-Founder",
        image: ProfileAndri,
        description: "Andri is a committed developer with frontend experience. He wants to continue his passion of being a frontend developer with constructing the best possible designs."
    },
    {
        name: "Danrave Keh",
        title: "Founder",
        image: ProfileDan,
        description: "As a founder and an aspiring machine engineer, Danrave hones his skills further by supporting both frontend and backend aspects of the website itself."
    },
    {
        name: "Judiel Oppura",
        title: "Co-Founder",
        image: ProfileJudiel,
        description: "Being curious about frontend development, Judiel strives to mark his development by assisting the whole website."
    },
    {
        name: "Vincent Pacaña",
        title: "Co-Founder",
        image: ProfileVincent,
        description: "Dedicated from the backend areas, Vincent brings functionality and balance in terms of maintenance and performance."
    },
    {
        name: "Josemar Pajares",
        title: "Co-Founder",
        image: ProfileJosemar,
        description: "Having a seasoned experience in the frontend areas, Josemar improves the base designs."
    }
];

const AboutUs = () => {
    return (
        <PageLayout>
            <section className="about-section">
                <h1 className="section-title">About ByteMarket</h1>
                <p className="about-description">
                    At ByteMarket, our team is dedicated to revolutionizing the way gamers access and trade digital assets.
                    Our platform provides a seamless marketplace for in-game credits, items, and purchases, including Steam wallets,
                    rank-boosting services, and more. With a focus on security, convenience, and affordability,
                    ByteMarket empowers players to enhance their gaming experience while fostering a vibrant community of enthusiasts.
                </p>
            </section>

            <section className="founders-section">
                <h2 className="section-title">PILLARS</h2>
                <div className="founders-grid">
                    {founders.map((founder, index) => (
                        <div className="founder-card" key={index}>
                            <div className="image-wrapper">
                                <img
                                    className="founder-image"
                                    src={founder.image}
                                    alt={`${founder.name}`}
                                />
                            </div>
                            <h4 className="founder-name">{founder.name}</h4>
                            <p className="founder-title">{founder.title}</p>
                            <p className="founder-description">{founder.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
};

export default AboutUs;
