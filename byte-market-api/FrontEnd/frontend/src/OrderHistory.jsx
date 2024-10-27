// UserOrderHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import './styles/OrderHistory.css';
import PageLayout from "./components/Layout.jsx";

const UserOrderHistory = () => {
    const { userid } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userid) {
            const fetchOrders = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/order/getAllOrder`);
                    const userOrders = response.data.filter(order => order.customer.userid === userid);
                    setOrders(userOrders);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [userid]);

    if (loading) return <p>Loading orders...</p>;
    if (orders.length === 0) return <p>No order history available.</p>;

    return (
        <PageLayout>
        <div className="order-history-container">
            <h3>Order History</h3>
            {orders.map(order => (
                <div key={order.orderid} className="order-card">
                    <p>Order ID: {order.orderid}</p>
                    <p>Status: {order.orderstatus}</p>
                    <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                    <div className="order-items">
                        <h4>Items:</h4>
                        {order.orderItems.map(item => (
                            <div key={item.orderitemid} className="order-item">
                                <p>Product Name: {item.product.productname}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price per item: ${item.price.toFixed(2)}</p>
                                <p>Seller: {item.product.seller.sellername} ({item.product.seller.storename})</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </PageLayout>
    );
};

export default UserOrderHistory;
