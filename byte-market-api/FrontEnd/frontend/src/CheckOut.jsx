import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import './styles/Checkout.css'; // Importing plain CSS instead of CSS module
import PageLayout from "./components/Layout.jsx";

const Checkout = () => {
    const { userid } = useAuth();
    const [pendingOrders, setPendingOrders] = useState(() => {
        const cachedPending = localStorage.getItem('pendingOrders');
        return cachedPending ? JSON.parse(cachedPending) : [];
    });
    const [completedOrders, setCompletedOrders] = useState(() => {
        const cachedCompleted = localStorage.getItem('completedOrders');
        return cachedCompleted ? JSON.parse(cachedCompleted) : [];
    });
    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null);

    const fetchSellerOrders = async () => {
        if (!userid) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/order/getAllOrder`);
            const sellerOrders = response.data.filter(order =>
                order.orderItems.some(item => item.product.seller.userid === userid)
            );
            const pending = sellerOrders.filter(order => order.orderstatus === 'Pending');
            const completed = sellerOrders.filter(order => order.orderstatus === 'Paid' || order.orderstatus === 'Completed');

            if (pending.length > 0 || completed.length > 0) {
                setPendingOrders(pending);
                setCompletedOrders(completed);
                localStorage.setItem('pendingOrders', JSON.stringify(pending));
                localStorage.setItem('completedOrders', JSON.stringify(completed));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userid) {
            fetchSellerOrders();
        }
    }, [userid]);


    const handleRefresh = () => {
        fetchSellerOrders();
    };

    const handleCheckout = async (order) => {
    const { orderid, customer, orderItems } = order;
    try {

        const sellerId = orderItems[0].product.seller.userid; // All items in the order belong to the same seller
        if (!sellerId) {
            setTransactionStatus({
                orderid,
                status: 'error',
                message: 'No seller found for this item in the order.',
            });
            return;
        }

        const transaction = {
            transactiontype: "PURCHASE",
        };

        const transactionUrl = `http://localhost:8080/api/transaction/addTransaction/${customer.userid}/${sellerId}/${orderid}`;

        try {
            // Send the transaction request once for the entire order
            const response = await axios.post(transactionUrl, transaction);

            setTransactionStatus({
                orderid,
                status: 'success',
                message: `Transaction for Order ${orderid} with Seller ${sellerId} completed successfully!`,
            });

            // Update local state and storage
            const updatedPendingOrders = pendingOrders.filter((o) => o.orderid !== orderid);
            const updatedCompletedOrders = [
                ...completedOrders,
                { ...order, orderstatus: 'Completed' }
            ];
            setPendingOrders(updatedPendingOrders);
            setCompletedOrders(updatedCompletedOrders);
            localStorage.setItem('pendingOrders', JSON.stringify(updatedPendingOrders));
            localStorage.setItem('completedOrders', JSON.stringify(updatedCompletedOrders));
        } catch (apiError) {
            setTransactionStatus({
                orderid,
                status: 'error',
                message: `Error processing transaction for Order ${orderid}.`,
            });
        }
    } catch (generalError) {
        setTransactionStatus({
            orderid,
            status: 'error',
            message: `Error processing transaction for Order ${orderid}.`,
        });
    }
};


    if (loading) return <p>Loading your orders...</p>;

    return (
        <PageLayout>
            <div className="checkoutPage">
                <h3>Your Orders to Fulfill</h3>
                <button className="refreshButton" onClick={handleRefresh}>
                    Refresh Orders
                </button>
                <div className="ordersSection">
                    <h4>Pending Orders</h4>
                    {pendingOrders.length > 0 ? (
                        pendingOrders.map((order) => (
                            <div key={order.orderid} className="orderCard pendingOrder">
                                <p>Order ID: {order.orderid}</p>
                                <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                                <h5>Products in Order:</h5>
                                <ul>
                                    {order.orderItems.map((item, index) => (
                                        <li key={item.id || `${order.orderid}-${index}`}>
                                            <p>Product Name: {item.product.productname}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: ${item.product.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handleCheckout(order)} className="fulfillButton">
                                    Fulfill Order
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No pending orders to fulfill.</p>
                    )}
                </div>
                <div className="ordersSection">
                    <h4>Completed Orders</h4>
                    {completedOrders.length > 0 ? (
                        completedOrders.map((order) => (
                            <div key={order.orderid} className="orderCard completedOrder">
                                <p>Order ID: {order.orderid}</p>
                                <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                                <p>Status: Completed</p>
                                <h5>Products in Order:</h5>
                                <ul>
                                    {order.orderItems.map((item, index) => (
                                        <li key={item.id || `${order.orderid}-${index}`}>
                                            <p>Product Name: {item.product.productname}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: ${item.product.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No completed orders.</p>
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
