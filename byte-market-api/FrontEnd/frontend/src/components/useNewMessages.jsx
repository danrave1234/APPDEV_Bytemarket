import { useState, useEffect } from 'react';

const useNewMessages = (recipientId, senderId, lastTimestamp, setLastTimestamp) => {
    const [newMessages, setNewMessages] = useState([]);

    useEffect(() => {
        if (!recipientId || !senderId || !lastTimestamp) return;

        // Fetch new messages function
        const fetchNewMessages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/message/getNewMessages?receiverId=${senderId}&senderId=${recipientId}&lastTimestamp=${lastTimestamp}`
                );
                if (!response.ok) throw new Error('Failed to fetch new messages');
                const data = await response.json();

                // Filter out duplicate messages based on message ID
                setNewMessages((prevMessages) => {
                    const newMessages = data.filter(
                        (msg) => !prevMessages.some((prevMsg) => prevMsg.messageId === msg.messageId)
                    );
                    if (newMessages.length > 0) {
                        const latestMessageTimestamp = newMessages[newMessages.length - 1].timestamp;
                        // Directly update the timestamp only when new messages arrive
                        if (latestMessageTimestamp !== lastTimestamp) {
                            setLastTimestamp(latestMessageTimestamp); // Update the parent state
                        }
                    }
                    return [ ...newMessages];
                });
            } catch (error) {
                console.error('Error fetching new messages:', error);
            }
        };

        const intervalId = setInterval(fetchNewMessages, 3000); // Poll every 3 seconds

        return () => {
            clearInterval(intervalId);
        };

    }, [recipientId, senderId, lastTimestamp, setLastTimestamp]);

    return newMessages;
};

export default useNewMessages;
