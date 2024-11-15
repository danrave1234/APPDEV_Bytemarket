import React, { useState, useEffect } from 'react';
import './OrderProductModal.css';
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

const OrderProductModal = ({ show, onClose, selectedProducts }) => {
    const { userid } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0); // State for wallet balance
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user's wallet balance when modal is shown
        if (show && userid) {
            const fetchWalletBalance = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    setWalletBalance(Number(response.data.balance || 0).toFixed(2));
                } catch (error) {
                    console.error('Error fetching wallet balance:', error);
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
            alert('Insufficient wallet balance. Please top up your wallet or reduce your order.');
            return; // Stop execution if wallet balance is insufficient
        }

        const orderPayload = {
            customer: { userid },
            orderItems: selectedProducts.map(product => ({
                product: { productid: product.productid },
                quantity: product.quantity,
            })),
        };

        try {
            await axios.post('http://localhost:8080/api/order/addOrder', orderPayload);
            alert('Order placed successfully!');
            onClose();
            navigate('/customer/orderHistory');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place the order.');
        }
    };

    const handleCancel = () => {
        const confirmCancel = window.confirm('Do you want to cancel the order?');
        if (confirmCancel) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div className="orderModal-overlay">
            <div className="orderModal-modal">
                <div className="orderModal-header">
                    <button className="orderModal-close-button" onClick={handleCancel}>&times;</button>
                    <h2>Checkout</h2>
                </div>
                <div className="orderModal-content">
                    <div className="orderModal-store-info">
                        <h3>Store: {selectedProducts[0]?.seller?.storename || 'Unknown Store'}</h3>
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
                                    <p className="orderModal-product-subtotal">Subtotal:
                                        ₱{(item.price * item.quantity).toFixed(2)}</p>
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
                    <button className="orderModal-place-order-button" onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div>
        </div>
    );
};

export default OrderProductModal;
