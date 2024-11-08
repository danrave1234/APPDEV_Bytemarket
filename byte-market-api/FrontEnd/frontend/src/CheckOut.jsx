// CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import './styles/Checkout.css';
import PageLayout from "./components/Layout.jsx";

const Checkout = () => {
    const { userid } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null); // To show feedback for each transaction

    useEffect(() => {
        if (userid) {
            const fetchSellerOrders = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/order/getAllOrder`);

                    // Filter orders where at least one order item is associated with the current seller's userid
                    const sellerOrders = response.data.filter(order =>
                        order.orderItems.some(item => item.product.seller.userid === userid)
                    );

                    setOrders(sellerOrders);
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
                const sellerId = item.product.seller.userid;
                if (!sellerId) {
                    setTransactionStatus({
                        orderid,
                        status: 'error',
                        message: 'No seller found for this item in the order.',
                    });
                    continue;
                }

                const transaction = {
                    transactiontype: "purchase", // Set a valid transaction type
                };

                const response = await axios.post(
                    `http://localhost:8080/api/transaction/addTransaction/${customer.userid}/${sellerId}/${orderid}`,
                    transaction
                );

                setTransactionStatus({
                    orderid,
                    status: 'success',
                    message: `Transaction for Order ${orderid} with Seller ${sellerId} completed successfully!`,
                });

                // Update local order status to 'Completed'
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.orderid === orderid ? { ...o, orderstatus: 'Completed' } : o
                    )
                );
            }
        } catch (error) {
            console.error('Error during transaction:', error);
            setTransactionStatus({
                orderid,
                status: 'error',
                message: `Error processing transaction for Order ${orderid}.`,
            });
        }
    };

    if (loading) return <p>Loading your orders...</p>;
    if (orders.length === 0) return <p>You have no orders available for checkout.</p>;

    return (
        <PageLayout>
            <div className="checkout-page">
                <h3>Your Orders to Fulfill</h3>
                {orders.map((order) => (
                    <div key={order.orderid} className="order-card">
                        <p>Order ID: {order.orderid}</p>
                        <p>Status: {order.orderstatus}</p>
                        <p>Total Price: ${order.totalprice.toFixed(2)}</p>
                        {order.orderstatus === 'Pending' ? (
                            <button onClick={() => handleCheckout(order)}>
                                Fulfill Order
                            </button>
                        ) : (
                            <p>This order has already been processed.</p>
                        )}
                    </div>
                ))}
                {transactionStatus && (
                    <div className={`transaction-feedback ${transactionStatus.status}`}>
                        {transactionStatus.message}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Checkout;
