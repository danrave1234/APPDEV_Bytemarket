import React, { useState } from 'react';
import './styles/ContactUs.css';
import PageLayout from './components/Layout.jsx';

const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure all fields are filled
        if (!email || !subject || !message) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // Show success message
        alert('Message submitted successfully!');

        // Clear input fields
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <PageLayout>
            <div className="contact-us-container">
                <h1>Contact Us</h1>
                <p>If you have any questions or need further assistance, feel free to contact us using the form below.</p>
                <form className="contact-us-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter the subject"
                        required
                    />

                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                        required
                    ></textarea>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </PageLayout>
    );
};

export default ContactUs;
