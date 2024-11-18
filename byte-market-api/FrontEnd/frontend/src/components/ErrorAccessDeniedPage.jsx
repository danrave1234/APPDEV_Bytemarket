import React from 'react';
import './ErrorAccessDeniedPage.css';
import PageLayout from './Layout.jsx';
import { useNavigate } from 'react-router-dom';

function ErrorAccessDeniedPage() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    }

    return (
        <PageLayout>
            <div className={"error-page"}>
                <div className="error-container">
                    <h1>Access Denied</h1>
                    <p>You do not have permission to access this page.</p>
                    <button onClick={handleHome}>Back to Home</button>
                </div>
            </div>
        </PageLayout>
    );
}

export default ErrorAccessDeniedPage;
