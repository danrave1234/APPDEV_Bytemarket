// useNewMessages.js
import { useEffect, useState } from 'react';

const useNewMessages = (recipientId, senderId, lastTimestamp) => {
    const [newMessages, setNewMessages] = useState([]);

    useEffect(() => {
        if (!recipientId || recipientId === 0) return;
        const interval = setInterval(() => {
            fetch(`http://localhost:8080/api/message/getNewMessages?receiverId=${recipientId}&senderId=${senderId}&lastTimestamp=${lastTimestamp}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setNewMessages(prev => [...prev, ...data]);
                    }
                })
                .catch(console.error);
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [recipientId, senderId, lastTimestamp]);

    return newMessages;
};

export default useNewMessages;