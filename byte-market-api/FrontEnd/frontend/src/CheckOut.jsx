import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import styles from './styles/Checkout.module.css';
import PageLayout from "./components/Layout.jsx";

const Checkout = () => {
    const { userid } = useAuth();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null);

    useEffect(() => {
        if (userid) {
            const fetchSellerOrders = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/order/getAllOrder`);

                    const sellerOrders = response.data.filter(order =>
                        order.orderItems.some(item => item.product.seller.userid === userid)
                    );

                    const pending = sellerOrders.filter(order => order.orderstatus === 'Pending');
                    const completed = sellerOrders.filter(order => order.orderstatus === 'Completed');

                    setPendingOrders(pending);
                    setCompletedOrders(completed);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSellerOrders();
        }
    }, [userid]);

    const handleCheckout = async (order) => {
    const { orderid, customer, orderItems } = order;

    try {
        for (const item of orderItems) {
            // Log item details to verify data structure
            console.log("Processing item:", item);

            const sellerId = item.product.seller.userid;
            if (!sellerId) {
                console.error(`Seller ID not found for item:`, item);
                setTransactionStatus({
                    orderid,
                    status: 'error',
                    message: 'No seller found for this item in the order.',
                });
                continue; // Skip this item if no sellerId is found
            }

            const transaction = {
                transactiontype: "purchase",
            };

            // Log the transaction URL and payload before the API call
            const transactionUrl = `http://localhost:8080/api/transaction/addTransaction/${customer.userid}/${sellerId}/${orderid}`;
            console.log("Transaction URL:", transactionUrl);
            console.log("Transaction Payload:", transaction);

            try {
                const response = await axios.post(transactionUrl, transaction);

                // Log the API response to ensure it's as expected
                console.log("Transaction response:", response.data);

                setTransactionStatus({
                    orderid,
                    status: 'success',
                    message: `Transaction for Order ${orderid} with Seller ${sellerId} completed successfully!`,
                });

                // Update order lists
                setPendingOrders((prevOrders) => prevOrders.filter((o) => o.orderid !== orderid));
                setCompletedOrders((prevOrders) => [
                    ...prevOrders,
                    { ...order, orderstatus: 'Completed' },
                ]);
            } catch (apiError) {
                // Log API error details specifically
                console.error("API Error during transaction:", apiError);
                setTransactionStatus({
                    orderid,
                    status: 'error',
                    message: `Error processing transaction for Order ${orderid}.`,
                });
            }
        }
    } catch (generalError) {
        // Log any other errors that might occur
        console.error('General error in handleCheckout:', generalError);
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
            <div className={styles.checkoutPage}>
                <h3>Your Orders to Fulfill</h3>

                <div className={styles.ordersSection}>
                    <h4>Pending Orders</h4>
                    {pendingOrders.length > 0 ? (
                        pendingOrders.map((order) => (
                            <div key={order.orderid} className={`${styles.orderCard} ${styles.pendingOrder}`}>
                                <p>Order ID: {order.orderid}</p>
                                <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                                <button onClick={() => handleCheckout(order)}>
                                    Fulfill Order
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No pending orders to fulfill.</p>
                    )}
                </div>

                <div className={styles.ordersSection}>
                    <h4>Completed Orders</h4>
                    {completedOrders.length > 0 ? (
                        completedOrders.map((order) => (
                            <div key={order.orderid} className={`${styles.orderCard} ${styles.completedOrder}`}>
                                <p>Order ID: {order.orderid}</p>
                                <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                                <p>Status: {order.orderstatus}</p>
                            </div>
                        ))
                    ) : (
                        <p>No completed orders.</p>
                    )}
                </div>

                {transactionStatus && (
                    <div className={`${styles.transactionFeedback} ${styles[transactionStatus.status]}`}>
                        {transactionStatus.message}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Checkout;
