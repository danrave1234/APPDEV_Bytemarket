import React, { useState, useEffect } from "react";
import "./OrderProductModal.css";
import axios from "axios";
import { useAuth } from "./AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import InsufficientWalletModal from "./InsufficientWalletModal";
import OrderSuccessModal from "./OrderSuccessModal";

const OrderProductModal = ({ show, onClose, selectedProducts }) => {
    const { userid } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [showInsufficientWalletModal, setShowInsufficientWalletModal] = useState(false);
    const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (show && userid) {
            const fetchWalletBalance = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    setWalletBalance(Number(response.data.balance || 0).toFixed(2));
                } catch (error) {
                    console.error("Error fetching wallet balance:", error);
                }
            };
            fetchWalletBalance();
        }
    }, [show, userid]);

    useEffect(() => {
        if (selectedProducts && selectedProducts.length > 0) {
            const price = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
            const quantity = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
            setTotalPrice(price.toFixed(2));
            setTotalQuantity(quantity);
        }
    }, [selectedProducts]);

    const handlePlaceOrder = async () => {
        if (parseFloat(totalPrice) > parseFloat(walletBalance)) {
            setShowInsufficientWalletModal(true);
            return;
        }

        const orderPayload = {
            customer: { userid },
            orderItems: selectedProducts.map((product) => ({
                product: { productid: product.productid },
                quantity: product.quantity,
            })),
        };

        try {
            await axios.post("http://localhost:8080/api/order/addOrder", orderPayload);
            setShowOrderSuccessModal(true);
            setTimeout(() => {
                onClose();
                navigate("/customer/orderHistory");
            }, 2000);
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const handleCancel = () => {
            onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="orderModal-overlay">
                <div className="orderModal-modal">
                    <div className="orderModal-header">
                        <button className="orderModal-close-button" onClick={handleCancel}>
                            &times;
                        </button>
                        <h2>Checkout</h2>
                    </div>
                    <div className="orderModal-content">
                        <div className="orderModal-store-info">
                            <h3>Store: {selectedProducts[0]?.seller?.storename || "Unknown Store"}</h3>
                        </div>
                        <div className="orderModal-products-list">
                            {selectedProducts.map((item, index) => (
                                <div className="orderModal-product-item" key={index}>
                                    <img
                                        className="orderModal-product-image"
                                        src={`data:image/jpeg;base64,${item.image}`}
                                        alt={item.productname}
                                    />
                                    <div className="orderModal-product-details">
                                        <p className="orderModal-product-name">{item.productname}</p>
                                        <p className="orderModal-product-quantity">Quantity: {item.quantity}</p>
                                        <p className="orderModal-product-price">Price: ₱{item.price.toFixed(2)}</p>
                                        <p className="orderModal-product-subtotal">
                                            Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="orderModal-summary">
                        <p>Current Wallet Balance: ₱{walletBalance}</p>
                        <p>Total Quantity: {totalQuantity}</p>
                    </div>
                    <div className="orderModal-footer">
                        <p className="orderModal-total-price">Total Price: ₱{totalPrice}</p>
                        <button className="orderModal-place-order-button" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals for alerts */}
            <InsufficientWalletModal
                isOpen={showInsufficientWalletModal}
                onClose={() => setShowInsufficientWalletModal(false)}
            />
            <OrderSuccessModal
                isOpen={showOrderSuccessModal}
                onClose={() => setShowOrderSuccessModal(false)}
            />
        </>
    );
};

export default OrderProductModal;
