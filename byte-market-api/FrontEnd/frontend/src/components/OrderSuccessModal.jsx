import React from "react";
import "./OrderSuccessModal.css";

const OrderSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="order-success-modal-overlay">
            <div className="order-success-modal-content">
                <button className="order-success-close-btn" onClick={onClose}>
                    X
                </button>
                <h3>Order Placed Successfully</h3>
                <p>Your order has been placed successfully! Thank you for shopping with us.</p>
                <button className="order-success-ok-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
