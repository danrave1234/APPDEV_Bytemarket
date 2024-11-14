import React from 'react';
import './Layout.css'; // Use Layout.css to style the greeting as part of the overall layout

const Greeting = ({ name, role }) => {
    let greetingMessage = '';

    if (role === 'Admin') {
        greetingMessage = `Greetings!`;
    } else if (role === 'Customer') {
        greetingMessage = `Welcome, ${name}!`;
    } else if (role === 'Seller') {
        greetingMessage = `It's sales time, ${name}!`;
    }

    return <div className="greeting-message">{greetingMessage}</div>;
};

export default Greeting;
