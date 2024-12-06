import React, { useEffect, useState, useRef } from 'react';
import useNewMessages from './useNewMessages';
import { useAuth } from './AuthProvider.jsx';
import './Chat.css';

const Chat = ({ onClose }) => {
    const { userid, role , setReceiverId, receiverId} = useAuth();
    const [messages, setMessages] = useState([]);
    const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
    const [inputValue, setInputValue] = useState('');
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [recipientName, setRecipientName] = useState(null);
    const [receiverData, setReceiverData] = useState(null);
    const newMessages = useNewMessages(selectedConversationId, lastTimestamp, setLastTimestamp);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/conversation/getAllConversationsByUserId?userId=${userid}`);
                if (!response.ok) {
                    console.error('Failed to fetch conversations:', response.status, response.statusText);
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
                console.log("Conversations of this user: ",data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setConversations([]);
            }
        };
        fetchConversations();
    }, [userid]);

useEffect(() => {
    if (!selectedConversationId) return;
    console.log("Selected Conversation ID WTFFFF: ",selectedConversationId);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/message/getConversation?conversationId=${selectedConversationId}`);
            const data = await response.json();
            setMessages(data);
            const receiverId = role === 'Customer' ? data[0].receiverId : data[0].senderId;
            setReceiverId(receiverId);
            console.log("Receiver ID: ", receiverId);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchReceiverName = async (receiverId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/${role === 'Customer' ? 'seller/getSellerNameById' : 'customer/getCustomerNameById'}/${receiverId}`);
            const data = await response.text();
            console.log("Receiver Name: ", data);
            setRecipientName(data);
        } catch (error) {
            console.error('Error fetching receiver name:', error);
        }
    };
    const setConversationRead = async () => {
        try {
            await fetch(`http://localhost:8080/api/conversation/setConversationRead/${selectedConversationId}`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Error setting conversation to read:', error);
        }
    };
    fetchMessages().then(() => {
        if (receiverId) {
            fetchReceiverName(receiverId);
        } else {
            console.error('Receiver ID is null');
        }
    });
    setConversationRead();
}, [selectedConversationId]);

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

    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedConversationId) return;
        console.log("Selected Conversation ID WTFFFF: ",selectedConversationId);
        fetch('http://localhost:8080/api/message/addMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: userid,
                receiverId: receiverId,
                conversationId: selectedConversationId,
                message: inputValue,
                timestamp: new Date().toISOString(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages((prev) => [...prev, data]);
                setLastTimestamp(data.timestamp);
                setInputValue('');
                fetch(`http://localhost:8080/api/conversation/updateLastMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversationId: selectedConversationId,
                        lastMessage: inputValue,
                    }),
                }).catch(console.error);
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
                            conversations.map((conv, index) => (
                                <div
                                    key={conv.conversationId}
                                    className={`conversation-item ${conv.read ? 'unread' : 'read'}`}
                                    onClick={() => setSelectedConversationId(conv.conversationId)}
                                >
                                    <div className="conversation-details">
                                        <div className="conversation-header">
                                            <span className="name">{recipientName}</span>
                                        </div>
                                        <p className={`last-message ${conv.read ? 'bold' : ''}`}>
                                            {/*{conv.read && <span className="unread">***Unread***  </span>}*/}
                                            {conv.lastMessage}
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
                        <h3>{selectedConversationId ? recipientName : 'Select a Conversation'}</h3>
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
                    {selectedConversationId && (
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