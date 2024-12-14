import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './components/AuthProvider.jsx';
import './styles/OrderHistory.css';
import PageLayout from './components/Layout.jsx';
import RatingModal from './components/RatingModal';

const OrderHistory = () => {
    const { userid } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [tab, setTab] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/order/getAllOrder');
                    const userOrders = response.data.filter(order => order.customer.userid === parseInt(userid));
                    userOrders.sort((a, b) => Number(b.orderid) - Number(a.orderid));
                    setOrders(userOrders);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
        };
        if (userid) {
            fetchOrders();
        }else{
            console.error("No user ID available.");
            setLoading(false);
        }
    }, [userid]);

    const filteredOrders = orders.filter(order => {
        if (tab === 'pending') return order.orderstatus === 'Pending';
        if (tab === 'completed') return order.orderstatus === 'Completed';
        return true;
    });
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [ordersResponse, referencesResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/order/getAllOrder'),
                    axios.get('http://localhost:8080/api/order/getCompletedOrderReferences'),
                ]);

                const userOrders = ordersResponse.data.filter(
                    (order) => order.customer.userid === parseInt(userid)
                );
                const referenceMap = new Map(
                    referencesResponse.data.map((ref) => [ref.orderId, ref.referenceNumber])
                );

                userOrders.forEach((order) => {
                    order.transactionReference = referenceMap.get(order.orderid) || null;
                });

                userOrders.sort((a, b) => Number(b.orderid) - Number(a.orderid));
                setOrders(userOrders);
            } catch (error) {
                console.error("Error fetching orders or references:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userid) {
            fetchOrders();
        } else {
            console.error("No user ID available.");
            setLoading(false);
        }
    }, [userid]);

    if (loading) {
        return (
            <PageLayout>
                <div className="spinner"></div>
            </PageLayout>
        );
    }

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
                    {filteredOrders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.orderid} className="order-card">
                                <div className="order-header">
                                    <p className="order-status">Status: {order.orderstatus}</p>
                                    <p className="order-total">Total: ₱{order.totalprice.toFixed(2)}</p>
                                </div>
                                <div className="order-items">
                                    {order.orderItems.map((item) => (
                                        <div key={item.orderitemid} className="order-item">
                                            <div className="item-left">
                                                <img
                                                    className="item-image"
                                                    src={`data:image/jpeg;base64,${item.product.image}`}
                                                    alt={item.product.productname}
                                                />
                                            </div>
                                            <div className="item-middle">
                                                <p className="item-name">{item.product.productname}</p>
                                                <p className="item-details">
                                                    Qty: {item.quantity} | ₱{item.price.toFixed(2)} each
                                                </p>
                                                <p className="item-seller">
                                                    Seller: {item.product.seller.sellername} ({item.product.seller.storename})
                                                </p>
                                                {order.transactionReference && (
                                                    <p
                                                        className="item-reference"
                                                        style={{
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            color: '#212850',
                                                            padding: '6px 12px',
                                                            paddingLeft: '0',
                                                            borderRadius: '6px',
                                                            marginTop: '8px',
                                                            display: 'inline-block',
                                                            fontFamily: 'Montserrat, sans-serif',
                                                        }}
                                                    >
                                                        <span style={{display: 'block', marginBottom: '4px'}}>Reference Number:</span>
                                                        <span style={{
                                                            fontSize: '11px',
                                                            display: 'block',
                                                            fontWeight: 'bold',
                                                            color: '#333'
                                                        }}>{order.transactionReference}</span>
                                                    </p>
                                                )}
{hasRatedProduct(item) ? (
    <button disabled>Thanks for rating</button>
) : (
    order.orderstatus === 'Completed' && (
        <button onClick={() => handleRatingClick(item.orderitemid, item.product.productid, item.product.productname, order.orderid)}>
            Rate this product
        </button>
    )
)}                           </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
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
