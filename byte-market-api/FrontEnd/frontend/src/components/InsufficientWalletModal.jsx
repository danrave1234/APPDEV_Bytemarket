import React from "react";
import "./InsufficientWalletModal.css";

const InsufficientWalletModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="insufficient-wallet-modal-overlay">
            <div className="insufficient-wallet-modal-content">
                <button className="insufficient-wallet-close-btn" onClick={onClose}>
                    X
                </button>
                <h3>Insufficient Wallet Balance</h3>
                <p>Your wallet balance is not enough to place this order. Please top up or reduce your order.</p>
                <button className="insufficient-wallet-ok-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default InsufficientWalletModal;
