import React, { useState } from 'react';
import { Client } from '@stomp/stompjs';

const MessageModal = ({ show, onClose, sellerId, customerId }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        const client = new Client({
            brokerURL: 'ws:http://localhost:8080/ws',
            onConnect: () => {
                client.publish({
                    destination: '/app/sendMessage',
                    body: JSON.stringify({
                        message,
                        sender: { userid: customerId },
                        receiver: { userid: sellerId }
                    })
                });
                onClose();
            }
        });
        client.activate();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Message Seller</h3>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <div className="modal-buttons">
                    <button onClick={sendMessage} className="send-btn">Send</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;