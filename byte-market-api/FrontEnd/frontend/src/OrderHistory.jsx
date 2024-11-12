import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './components/AuthProvider.jsx';
import './styles/OrderHistory.css';
import PageLayout from './components/Layout.jsx';
import RatingModal from './components/RatingModal';

const OrderHistory = () => {
    const { userid } = useAuth();
    const [orders, setOrders] = useState(() => {
        const cachedOrders = localStorage.getItem('userOrders');
        return cachedOrders ? JSON.parse(cachedOrders) : [];
    });
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [tab, setTab] = useState('all');  // Tab to filter orders: 'all', 'pending', or 'completed'

    useEffect(() => {
        if (userid) {
            const fetchOrders = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:8080/api/order/getAllOrder');
                    const userOrders = response.data.filter(order => order.customer.userid === userid);
                    userOrders.sort((a, b) => Number(b.orderid) - Number(a.orderid));
                    if (userOrders.length > 0) {
                        setOrders(userOrders);
                        localStorage.setItem('userOrders', JSON.stringify(userOrders));
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [userid]);

    const handleRatingClick = (orderItemId, productId, productName, orderId) => {
        setCurrentItem({ orderItemId, productId, productName, orderId });
        setShowRatingModal(true);
    };

    const submitRating = async (ratingScore, ratingText) => {
        try {
            await axios.post('http://localhost:8080/api/rating/addRating', {
                score: ratingScore,
                ratingtext: ratingText,
                customer: { userid },
                product: { productid: currentItem.productId },
            });
            await axios.put(`http://localhost:8080/api/order/orderItem/${currentItem.orderItemId}/isRated`, null, {
                params: { isRated: true },
            });
            setShowRatingModal(false);

            setOrders(prevOrders => {
                return prevOrders.map(order => {
                    if (order.orderid === currentItem.orderId) {
                        return {
                            ...order,
                            orderItems: order.orderItems.map(item => {
                                if (item.orderitemid === currentItem.orderItemId) {
                                    return {
                                        ...item,
                                        rated: true,
                                    };
                                }
                                return item;
                            }),
                        };
                    }
                    return order;
                });
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const hasRatedProduct = (orderItem) => orderItem.rated;

    // Filter orders based on tab selection
    const filteredOrders = orders.filter(order => {
        if (tab === 'pending') return order.orderstatus === 'Pending';
        if (tab === 'completed') return order.orderstatus === 'Completed';
        return true;  // Show all orders by default
    });

    if (loading) return <p>Loading orders...</p>;
    if (filteredOrders.length === 0) return <p>No order history available.</p>;

    return (
        <PageLayout>
            <div className="order-history-container">
                <h3>Your Order History</h3>

                {/* Tab navigation */}
                <div className="tab-navigation">
                    <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Orders</button>
                    <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>Pending Orders</button>
                    <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Completed Orders</button>
                </div>

                {/* Single Card Layout for Orders */}
                <div className="orders-list">
                    {filteredOrders.map(order => (
                        <div key={order.orderid} className="order-card">
                            <div className="order-header">
                                <p className="order-id">Order ID: {order.orderid}</p>
                                <p className="order-status">Status: {order.orderstatus}</p>
                                <p className="order-total">Total: ${order.totalprice.toFixed(2)}</p>
                            </div>
                            <div className="order-items">
                                {order.orderItems.map(item => (
                                    <div key={item.orderitemid} className="order-item">
                                        <div className="item-left">
                                            <img
                                                className="item-image"
                                                src={`data:image/jpeg;base64,${item.product.image}` || '/path/to/placeholder.jpg'} // Placeholder image path
                                                alt={item.product.productname}
                                            />
                                        </div>
                                        <div className="item-middle">
                                            <p className="item-name">{item.product.productname}</p>
                                            <p className="item-details">Qty: {item.quantity} | ${item.price.toFixed(2)} each</p>
                                            <p className="item-seller">Seller: {item.product.seller.sellername} ({item.product.seller.storename})</p>
                                        </div>
                                        <div className="item-right">
                                            {hasRatedProduct(item) ? (
                                                <p className="rating-message">Thanks for your rating!</p>
                                            ) : (
                                                (order.orderstatus === 'Paid' || order.orderstatus === 'Completed') && (
                                                    <button
                                                        className="rate-button"
                                                        onClick={() =>
                                                            handleRatingClick(
                                                                item.orderitemid,
                                                                item.product.productid,
                                                                item.product.productname,
                                                                order.orderid
                                                            )
                                                        }
                                                    >
                                                        Rate this product
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showRatingModal && (
                <RatingModal
                    showModal={showRatingModal}
                    onClose={() => setShowRatingModal(false)}
                    onSubmit={submitRating}
                    productName={currentItem.productName}
                />
            )}
        </PageLayout>
    );
};

export default OrderHistory;
