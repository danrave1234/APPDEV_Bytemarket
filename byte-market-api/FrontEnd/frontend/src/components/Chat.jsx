import React, { useEffect, useState, useRef } from 'react';
import useNewMessages from './useNewMessages';
import { useAuth } from './AuthProvider.jsx';
import { Search, Send, X, Check, CheckCheck } from 'lucide-react';
import './Chat.css';

const Chat = ({ onClose }) => {
    const { userid, role, setReceiverId, receiverId } = useAuth();
    const [messages, setMessages] = useState([]);
    const [lastTimestamp, setLastTimestamp] = useState(new Date().toISOString());
    const [inputValue, setInputValue] = useState('');
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [recipientName, setRecipientName] = useState(null);
    const [receiverData, setReceiverData] = useState(null);
    const newMessages = useNewMessages(selectedConversationId, lastTimestamp, setLastTimestamp);
    const messagesEndRef = useRef(null);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/conversation/getAllConversationsByUserId?userId=${userid}`);
            if (!response.ok) throw new Error('Failed to fetch conversations');
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedConversationId]);

    useEffect(() => {
        fetchConversations();
    }, [userid]);

    useEffect(() => {
        if (!selectedConversationId) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/message/getConversation?conversationId=${selectedConversationId}`
                );
                const data = await response.json();
                setMessages(data);
                scrollToBottom();

                const receiverId = role === 'Customer' ? data[0].receiverId : data[0].senderId;
                fetchReceiverName(receiverId);
                setReceiverId(receiverId);
                setConversationRead();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchReceiverName = async (receiverId) => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/${role === 'Customer' ? 'seller/getSellerNameById' : 'customer/getCustomerNameById'}/${receiverId}`
                );
                const data = await response.text();
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
                fetchConversations();
            } catch (error) {
                console.error('Error setting conversation to read:', error);
            }
        };

        fetchMessages();
    }, [selectedConversationId]);

    useEffect(() => {
        if (newMessages.length > 0) {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
            scrollToBottom();
            fetchConversations();
        }
    }, [newMessages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedConversationId) return;

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
                scrollToBottom();

                fetch(`http://localhost:8080/api/conversation/updateLastMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversationId: selectedConversationId,
                        lastMessage: inputValue,
                    }),
                }).catch(console.error);

                fetchConversations();
            })
            .catch(console.error);
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>Messages</h2>
                <div className="chat-header-icons">
                    <button className="icon-button" onClick={onClose}>
                        <X className="icon" />
                    </button>
                </div>
            </div>
            <div className="chat-body">
                <div className="sidebar">
                    <div className="search-bar">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search conversations..." />
                    </div>
                    <div className="conversation-list">
                        {conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <div
                                    key={conv.conversationId}
                                    className={`conversation-item ${conv.read ? 'read' : 'unread'} ${
                                        selectedConversationId === conv.conversationId ? 'active' : ''
                                    }`}
                                    onClick={() => setSelectedConversationId(conv.conversationId)}
                                >
                                    <div className="conversation-avatar">
                                        <img
                                            src={`data:image/jpeg;base64,${role === 'Customer' ? conv.receiver.profilepic : conv.sender.profilepic}`}
                                            alt="Profile"
                                            className="conversation-image"
                                        />
                                        {!conv.read && <span className="unread-indicator" />}
                                    </div>
                                    <div className="conversation-details">
                                        <div className="conversation-header">
                                            <span className="name">
                                                {role === 'Customer' ? conv.receiver.fullname : conv.sender.fullname}
                                            </span>
                                            <button
                                                className="delete-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this conversation?')) {
                                                        fetch(`http://localhost:8080/api/conversation/deleteConversation/${conv.conversationId}`, {
                                                            method: 'DELETE',
                                                        })
                                                            .then((response) => {
                                                                if (response.ok) {
                                                                    setConversations((prev) =>
                                                                        prev.filter((c) => c.conversationId !== conv.conversationId)
                                                                    );
                                                                } else {
                                                                    console.error('Failed to delete conversation');
                                                                }
                                                            })
                                                            .catch((error) => console.error('Error:', error));
                                                    }
                                                }}
                                            >
                                                <X className="icon-small" />
                                            </button>
                                        </div>
                                        <p className={`last-message ${conv.read ? '' : 'bold'}`}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-conversations">
                                <p>No conversations yet</p>
                                <span className="no-conversations-subtitle">Messages from your conversations will appear here</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="chat-main">
                    <div className="chat-main-header">
                        {selectedConversationId ? (
                            <div className="selected-chat-header">
                                <h3>{recipientName}</h3>
                                {conversations.find(conv => conv.conversationId === selectedConversationId)?.read && (
                                    <span className="seen-status">
                                        <CheckCheck className="icon-small" /> Delivered
                                    </span>
                                )}
                            </div>
                        ) : (
                            <h3>Select a Conversation</h3>
                        )}
                    </div>
                    <div className="messages">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.senderId === userid ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        {msg.message}
                                    </div>
                                    {msg.senderId === userid && (
                                        <span className="message-status">
                                            {conversations.find(conv => conv.conversationId === selectedConversationId)?.read ? (
                                                <CheckCheck className="icon-tiny" />
                                            )  : (
                                                <Check className="icon-tiny" />
                                            )}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-messages">
                                <p>No messages yet</p>
                                <span className="no-messages-subtitle">Start the conversation!</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {selectedConversationId && (
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                className="send-button"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                            >
                                <Send className="icon" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;

