import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Wishlist.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useNavigate } from 'react-router-dom';

function Wishlist() {
    const { userid } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productId, setProductId] = useState('');
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchWishlistItems();
    }, [userid]);

    const fetchWishlistItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/getAllWishlist`);
            // Sort the items by date immediately when receiving them
            const sortedItems = response.data.sort((a, b) =>
                new Date(b.wishlistdate).getTime() - new Date(a.wishlistdate).getTime()
            );
            setWishlistItems(sortedItems);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        if (!productId.trim()) return;

        try {
            const wishlistItem = {
                wishlistdate: new Date().toISOString(),
                customer: { userid: userid },
                wishlistProducts: [{ productid: parseInt(productId) }]
            };

            await axios.post('http://localhost:8080/api/wishlist/addWishlist', wishlistItem);
            fetchWishlistItems();
            setProductId('');
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/wishlist/deleteWishlist/${selectedItemId}`);
            setWishlistItems(prevItems => prevItems.filter(item => item.wishlistid !== selectedItemId));
            setShowRemoveModal(false);
            setShowRemoveConfirmModal(true);
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const cartItem = {
                quantity: 1,
                dateposted: new Date().toISOString(),
                customer: { userid: userid },
                product: { productid: product.productid }
            };

            await axios.post('http://localhost:8080/api/cart/addCart', cartItem);
            setShowAddToCartModal(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleBuyNow = async (product) => {
        await handleAddToCart(product);
        navigate('/customer/addToCart');
    };

    const getSortedItems = () => {
        let sortedProducts = [...wishlistItems];
        switch(sortBy) {
            case 'priceLow':
                return sortedProducts.sort((a, b) =>
                    a.wishlistProducts[0].price - b.wishlistProducts[0].price
                );
            case 'priceHigh':
                return sortedProducts.sort((a, b) =>
                    b.wishlistProducts[0].price - a.wishlistProducts[0].price
                );
            case 'alpha':
                return sortedProducts.sort((a, b) =>
                    a.wishlistProducts[0].productname.localeCompare(b.wishlistProducts[0].productname)
                );
            case 'recent':
            default:
                // Ensure proper date comparison by converting to timestamps
                return sortedProducts.sort((a, b) => {
                    const dateA = new Date(a.wishlistdate).getTime();
                    const dateB = new Date(b.wishlistdate).getTime();
                    return dateB - dateA; // Most recent first
                });
        }
    };

    if (loading) return <p>Loading your wishlist...</p>;

    return (
        <PageLayout>
            <div className="wishlist-container">
                {/* Top section with input and sort buttons */}
                <div className="top-section">
                    {/* Test input section - TO BE REMOVED IN PRODUCTION */}
                    <div className="test-input-section">
                        <input
                            type="text"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            placeholder="Test: Enter Product ID"
                            className="product-id-input"
                        />
                        <button onClick={handleAddProduct} className="add-btn">Add</button>
                    </div>

                    {/* Sort buttons */}
                    <div className="sort-buttons">
                        <button
                            className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                            onClick={() => setSortBy('recent')}
                        >
                            Default
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'priceLow' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceLow')}
                        >
                            By Price Lowest
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'priceHigh' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceHigh')}
                        >
                            By Price Highest
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'alpha' ? 'active' : ''}`}
                            onClick={() => setSortBy('alpha')}
                        >
                            Alphabetical
                        </button>
                    </div>
                </div>

                <div className="products-outer-container">
                    {wishlistItems.length === 0 ? (
                        <p>Your wishlist is empty. Start adding some products!</p>
                    ) : (
                        <div className="wishlist-grid">
                            {getSortedItems().map((item) => (
                                item.wishlistProducts.map((product) => (
                                    <div className="product-card" key={product.productid}>
                                        <div className="product-image">
                                            <div className="image-placeholder">
                                                Empty box For Picture
                                            </div>
                                        </div>
                                        <div className="product-details">
                                            <h3 className="product-title">{product.productname}</h3>
                                            <p className="product-price">${product.price?.toFixed(2)}</p>
                                            <div className="product-rating">
                                                ⭐ {product.rating}
                                            </div>
                                            <div className="product-note">Note!: For Christmas Gift</div>
                                            <div className="product-actions">
                                                <button
                                                    className="buy-now-btn"
                                                    onClick={() => handleBuyNow(product)}
                                                >
                                                    Buy Now
                                                </button>
                                                <button
                                                    className="cart-btn"
                                                    onClick={() => handleAddToCart(product)}
                                                    title="Add to cart"
                                                >
                                                    🛒
                                                </button>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => {
                                                        setSelectedItemId(item.wishlistid);
                                                        setShowRemoveModal(true);
                                                    }}
                                                    title="Remove"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showRemoveModal && (
                    <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Remove from Favorites</h3>
                            <div className="modal-buttons">
                                <button onClick={() => setShowRemoveModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button onClick={handleRemoveFromWishlist} className="confirm-btn">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showRemoveConfirmModal && (
                    <div className="modal-overlay" onClick={() => setShowRemoveConfirmModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <p>Item Removed from favorites.</p>
                        </div>
                    </div>
                )}

                {showAddToCartModal && (
                    <div className="modal-overlay" onClick={() => setShowAddToCartModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <p>Item added to cart</p>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default Wishlist;