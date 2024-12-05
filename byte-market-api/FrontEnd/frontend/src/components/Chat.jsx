// Chat.jsx
import React, { useEffect, useState } from 'react';
import useNewMessages from './useNewMessages';
import './Chat.css';
import { useAuth } from './AuthProvider.jsx';

const Chat = ({ onClose }) => {
    const { receiverId, senderId, setReceiverId, setSenderId, role, userid} = useAuth();
    const [messages, setMessages] = useState([]);
    const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
    const [inputValue, setInputValue] = useState('');
    const [selectedRecipientId, setSelectedRecipientId] = useState(receiverId);
    const [conversations, setConversations] = useState([]);
    const newMessages = useNewMessages(selectedRecipientId, senderId, lastTimestamp);
    const [sellerName, setSellerName] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/message/getAllConversation?${role === 'Customer' ? `senderId=${senderId}` : `receiverId=${receiverId}`}`);;
                if (!response.ok) throw new Error('Failed to fetch conversations');
                const data = await response.json();
                setConversations(data);
                setSenderId(data[0].senderId);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setConversations([]);
            }
        };
        fetchConversations();
    }, [senderId]);

    useEffect(() => {
        if (selectedRecipientId) {
            const fetchSellerName = async (sellerId) => {
                try {
                    const response = await fetch(`http://localhost:8080/api/seller/getSellerNameById/${sellerId}`);
                    if (!response.ok) throw new Error('Failed to fetch seller name');
                    const data = await response.text();
                    setSellerName(data);
                } catch (error) {
                    console.error('Error fetching seller name:', error);
                    setSellerName([]);
                }
            };
            fetchSellerName(selectedRecipientId);
        }
    }, [selectedRecipientId]);

    useEffect(() => {
        if (newMessages.length > 0) {
            setMessages((prev) => [...prev, ...newMessages]);
            const latestTimestamp = newMessages[newMessages.length - 1].timestamp;
            setLastTimestamp(latestTimestamp);
        }
    }, [newMessages]);

    const loadChatHistory = (recipientId) => {
        setSelectedRecipientId(recipientId);

        fetch(`http://localhost:8080/api/message/getAllConversation?receiverId=${senderId}&senderId=${recipientId}`)
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);

                if (role === 'Seller' && data.length > 0) {
                    // Infer senderId from messages
                    const inferredSenderId = data[0].senderId;
                    setSenderId(inferredSenderId);
                    console.log("userId: ", userid);
                    console.log("Inferred Sender ID: ", inferredSenderId);
                }
            })
            .catch((error) => console.error('Error loading chat history:', error));
    };




    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedRecipientId) return;

        fetch('http://localhost:8080/api/message/addMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId,
                receiverId: selectedRecipientId,
                message: inputValue,
                timestamp: new Date().toISOString(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages((prev) => [...prev, data]);
                setLastTimestamp(data.timestamp);
                setInputValue('');
            })
            .catch(console.error);
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>Chat</h2>
                <div className="chat-header-icons">
                    <span className="icon">⇱</span>
                    <span className="icon" onClick={onClose}>✕</span>
                </div>
            </div>
            <div className="chat-body">
                <div className="sidebar">
                    <div className="search-bar">
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="conversation-list">
                        {conversations.length > 0 ? (
                            conversations.map((conv, index) => (
                                <div
                                    key={`${conv.receiverId}-${index}`}
                                    className="conversation-item"
                                    onClick={() => loadChatHistory(conv.receiverId)}
                                >
                                    <img src={conv.avatar || '/placeholder.svg'} alt={conv.name} className="avatar" />
                                    <div className="conversation-details">
                                        <div className="conversation-header">
                                            <span className="name">{conv.name}</span>
                                            <span className="time">{conv.time}</span>
                                        </div>
                                        <p className="last-message">{conv.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No conversations available</p>
                        )}
                    </div>
                </div>
                <div className="chat-main">
                    <div className="chat-main-header">
                        <h3>{selectedRecipientId ? `${sellerName}` : 'Select a Conversation'}</h3>
                    </div>
                    <div className="messages">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={msg.senderId === userid ? 'sent' : 'received'}
                                >
                                    {msg.message}
                                </div>
                            ))
                        ) : (
                            <p>No messages yet</p>
                        )}
                    </div>

                    {selectedRecipientId && (
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type a message here"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                }}
                            />
                            <div className="input-icons">
                                <span className="icon" onClick={handleSendMessage}>➤</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;// Chat.jsx
