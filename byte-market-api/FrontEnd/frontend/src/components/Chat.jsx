import React, { useEffect, useState, useRef } from 'react';
import useNewMessages from './useNewMessages';
import { useAuth } from './AuthProvider.jsx';
import './Chat.css';

const Chat = ({ onClose }) => {
    const { userid, role } = useAuth();
    const [messages, setMessages] = useState([]);
    const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
    const [inputValue, setInputValue] = useState('');
    const [selectedRecipientId, setSelectedRecipientId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [recipientName, setRecipientName] = useState(null);
    const [receiverData, setReceiverData] = useState(null);
    const newMessages = useNewMessages(selectedRecipientId, userid, lastTimestamp, setLastTimestamp);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/message/getAllConversation?senderId=${userid}`);
                if (!response.ok) throw new Error('Failed to fetch conversations');
                const data = await response.json();
                if (role === 'Seller') {
                    setSelectedRecipientId(data[0]?.senderId);
                }
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setConversations([]);
            }
        };
        fetchConversations();
    }, [userid, role]);

    useEffect(() => {
        if (!selectedRecipientId) return;

        const fetchRecipientName = async () => {
            const endpoint = role === 'Seller'
                ? `http://localhost:8080/api/customer/getCustomerById/${selectedRecipientId}`
                : `http://localhost:8080/api/seller/getSellerById/${selectedRecipientId}`;

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                setReceiverData(data);
                setRecipientName(role === 'Seller' ? data.fullname : data.storename);
            } catch (error) {
                console.error('Error fetching recipient name:', error);
                setRecipientName('Unknown');
            }
        };

        fetchRecipientName();
    }, [selectedRecipientId, role]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (newMessages.length > 0) {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
            setLastTimestamp(newMessages[newMessages.length - 1].timestamp);
        }
    }, [newMessages]);

    const loadChatHistory = (recipientId) => {
        setSelectedRecipientId(recipientId);
        fetch(`http://localhost:8080/api/message/getAllConversation?receiverId=${userid}&senderId=${recipientId}`)
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
            })
            .catch((error) => console.error('Error loading chat history:', error));
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedRecipientId) return;

        fetch('http://localhost:8080/api/message/addMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: userid,
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
                            [...new Map(conversations.map(conv => [conv.receiverId, conv])).values()].map((conv, index) => (
                                <div
                                    key={`${conv.receiverId}-${index}`}
                                    className={`conversation-item ${conv.unread ? 'unread' : ''}`}
                                    onClick={() => loadChatHistory(conv.receiverId)}
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${receiverData?.storeimage || receiverData?.profilepic}`}
                                        alt={receiverData?.storename || 'Recipient'}
                                        className="avatar"
                                    />
                                    <div className="conversation-details">
                                        <div className="conversation-header">
                                            <span className="name">{recipientName || 'Recipient'}</span>
                                            <span className="time">{new Date(conv.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className={`last-message ${conv.unread ? 'bold' : ''}`}>
                                            {conv.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-conversations">No conversations available</p>
                        )}
                    </div>
                </div>
                <div className="chat-main">
                    <div className="chat-main-header">
                        <h3>{selectedRecipientId ? recipientName : 'Select a Conversation'}</h3>
                    </div>
                    <div className="messages" ref={messagesEndRef}>
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
                            <p className="no-messages">No messages yet</p>
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

export default Chat;

