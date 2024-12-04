import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import './styles/Checkout.css';
import PageLayout from "./components/Layout.jsx";

const Checkout = () => {
    const { userid } = useAuth();
    const [orders, setOrders] = useState({ pending: [], completed: [] });
    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [filter, setFilter] = useState('pending'); // State to manage the filter

    const fetchSellerOrders = useCallback(async () => {
        if (!userid) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/order/getAllOrder`);
            const sellerOrders = response.data.filter(order =>
                order.orderItems.some(item => item.product.seller.userid === userid)
            );
            const pending = sellerOrders.filter(order => order.orderstatus === 'Pending');
            const completed = sellerOrders.filter(order => ['Paid', 'Completed'].includes(order.orderstatus));

            setOrders({ pending, completed });
            localStorage.setItem('pendingOrders', JSON.stringify(pending));
            localStorage.setItem('completedOrders', JSON.stringify(completed));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [userid]);

    useEffect(() => {
        if (userid) {
            fetchSellerOrders();
        }
    }, [userid, fetchSellerOrders]);

    const handleCheckout = async (order) => {
        const { orderid, customer, orderItems } = order;
        try {
            const sellerId = orderItems[0].product.seller.userid;
            if (!sellerId) {
                throw new Error('No seller found for this item in the order.');
            }

            const transactionUrl = `http://localhost:8080/api/transaction/addTransaction/${customer.userid}/${sellerId}/${orderid}`;
            await axios.post(transactionUrl, { transactiontype: "PURCHASE" });

            setTransactionStatus({
                orderid,
                status: 'success',
                message: `Transaction for Order ${orderid} with Seller ${sellerId} completed successfully!`,
            });

            setOrders(prevOrders => ({
                pending: prevOrders.pending.filter(o => o.orderid !== orderid),
                completed: [...prevOrders.completed, { ...order, orderstatus: 'Completed' }]
            }));
        } catch (error) {
            setTransactionStatus({
                orderid,
                status: 'error',
                message: `Error processing transaction for Order ${orderid}: ${error.message}`,
            });
        }
    };

    const renderOrderCard = (order, isPending) => (
        <div key={order.orderid} className={`orderCard ${isPending ? 'pendingOrder' : 'completedOrder'}`}>
            <div className="order-header">
                <h4>Order ID: {order.orderid}</h4>
                <p className="order-total">Total Price: ₱{order.totalprice.toFixed(2)}</p>
                {!isPending && <p className="order-status">Status: Completed</p>}
            </div>
            <h5>Products in Order:</h5>
            <ul>
                {order.orderItems.map((item, index) => (
                    <li key={item.id || `${order.orderid}-${index}`}>
                        <div className="product-info">
                            {item.product.image ? (
                                <img src={`data:image/jpeg;base64,${item.product.image}`} alt={item.product.productname} className="product-image" />
                            ) : (
                                <div className="image-placeholder">No Image</div>
                            )}
                            <div>
                                <p className="item-name">{item.product.productname}</p>
                                <p className="item-details">Quantity: {item.quantity} | ₱{item.price.toFixed(2)} each</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {isPending && (
                <button onClick={() => handleCheckout(order)} className="fulfillButton">
                    Fulfill Order
                </button>
            )}
        </div>
    );

    if (loading) {
        return (
            <PageLayout>
                <div className="spinner"></div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="checkoutPage">
                <h3>Your Orders to Fulfill</h3>
                <div className="button-container">
                    <button className="refreshButton" onClick={fetchSellerOrders}>
                        Refresh Orders
                    </button>
                    <div className="filter-buttons">
                        <button className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}>
                            Pending Orders
                        </button>
                        <button className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}>
                            Completed Orders
                        </button>
                    </div>
                </div>
                <div className="ordersSection">
                    {filter === 'pending' ? (
                        <>
                            <h4>Pending Orders</h4>
                            {orders.pending.length > 0 ? (
                                orders.pending.map(order => renderOrderCard(order, true))
                            ) : (
                                <p>No pending orders to fulfill.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <h4>Completed Orders</h4>
                            {orders.completed.length > 0 ? (
                                orders.completed.map(order => renderOrderCard(order, false))
                            ) : (
                                <p>No completed orders.</p>
                            )}
                        </>
                    )}
                </div>
                {transactionStatus && (
                    <div className={`transactionFeedback ${transactionStatus.status}`}>
                        {transactionStatus.message}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Checkout;