import React, { useState } from 'react';
import TheRoutes from "./Routes.jsx";
import './styles/App.css';
import useScrollToTop from "./components/UseScrollOnTop.jsx";
import Chat from "./components/Chat.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

//Dont TOUCH! unless Necessary
function App() {
    const [isChatVisible, setIsChatVisible] = useState(false);

    useScrollToTop();
    return (
        <>
            <TheRoutes />
            {isChatVisible && <Chat onClose={() => setIsChatVisible(false)} />}
            {!isChatVisible && (
                <button
                    onClick={() => setIsChatVisible(true)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Open Chat
                </button>
            )}
        </>
    );
}

export default App;