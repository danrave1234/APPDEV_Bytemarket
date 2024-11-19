import React from 'react';
import './Error404Page.css';
import PageLayout from './Layout.jsx';
import { useNavigate } from 'react-router-dom';

function Error404Page() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    }

    return (
        <PageLayout>
            <div className="error-page">
                <div className="error-container">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <button onClick={handleHome}>Back to Home</button>
                </div>
            </div>
        </PageLayout>
    );
}

export default Error404Page;