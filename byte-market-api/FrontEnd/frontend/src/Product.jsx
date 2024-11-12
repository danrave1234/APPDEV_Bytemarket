import './styles/Product.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product() {
    const { userid } = useAuth();
    const { productid } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);

    const navigate = useNavigate();  // Hook for navigation

    useEffect(() => {
        fetchProduct();
        checkIfProductInWishlist();
    }, [productid, userid]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product/getProductById/${productid}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    const checkIfProductInWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/getWishlistByUserId/${userid}`);
            const wishlistItems = response.data;
            const isInWishlist = wishlistItems.some(item =>
                item.wishlistProducts.some(product => product.productid === parseInt(productid))
            );
            setIsWishlisted(isInWishlist);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const handleAddToCart = async () => {
        try {
            const cartItem = {
                quantity: quantity,
                dateposted: new Date().toISOString(),
                customer: { userid: userid },
                product: { productid: product.productid }
            };
            await axios.post('http://localhost:8080/api/cart/addCart', cartItem);
            setShowAddToCartModal(true);  // Show add to cart modal
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product?.quantity) {
            setQuantity(newQuantity);
        }
    };

    const toggleWishlist = async () => {
        if (isWishlisted) {
            setShowWishlistModal(true);  // Show confirmation modal for removal
        } else {
            setIsAddingToWishlist(true);
            try {
                // Add product to wishlist
                const wishlistItem = {
                    wishlistdate: new Date().toISOString(),
                    customer: { userid: userid },
                    wishlistProducts: [{ productid: product.productid }]
                };
                await axios.post('http://localhost:8080/api/wishlist/addWishlist', wishlistItem);
                setIsWishlisted(true);  // Update the heart to red
                setIsAddingToWishlist(false);
                setShowAddToCartModal(true);  // Show added to wishlist modal
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                setIsAddingToWishlist(false);
            }
        }
    };

    const removeFromWishlist = async () => {
        try {
            // Fetch the user's wishlist to find the item to remove
            const response = await axios.get(`http://localhost:8080/api/wishlist/getWishlistByUserId/${userid}`);
            const wishlistItems = response.data;
            const wishlistItemToRemove = wishlistItems.find(item =>
                item.wishlistProducts.some(product => product.productid === parseInt(productid))
            );

            if (wishlistItemToRemove) {
                await axios.delete(`http://localhost:8080/api/wishlist/deleteWishlist/${wishlistItemToRemove.wishlistid}`);
                setIsWishlisted(false);  // Remove the red heart
                setShowRemoveConfirmModal(true);  // Show confirmation modal
                setShowWishlistModal(false);  // Close the modal
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleBuyNow = async () => {
        try {
            const cartItem = {
                quantity: quantity,
                dateposted: new Date().toISOString(),
                customer: { userid: userid },
                product: { productid: product.productid }
            };
            await axios.post('http://localhost:8080/api/cart/addCart', cartItem);
            // Redirect to the checkout page after adding the item to the cart
            navigate('/customer/CheckOut');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) return (
        <PageLayout>
            <div className="container">
                <div className="loading">Loading...</div>
            </div>
        </PageLayout>
    );

    const imageBase64 = product?.image ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}` : null;
    return (
        <PageLayout>
            <div className="container">
                <div className="product-container">
                    <div className="product-content">
                        <div className="product-image-section">
                            <div className="image-container">
                                {imageBase64 ? (
                                    <img src={imageBase64} alt={product?.productname} className="product-image" />
                                ) : (
                                    <div className="image-placeholder">No image available</div>
                                )}
                            </div>
                        </div>

                        <div className="product-info-section">
                            <div className="product-header">
                                <h1 className="product-title">{product?.productname}</h1>
                                <button
                                    onClick={toggleWishlist}
                                    className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    {isWishlisted ? '❤️' : '🤍'}
                                </button>
                            </div>

                            <div className="product-rating">
                                ⭐ {product.ratings?.length > 0
                                ? (product.ratings.reduce((acc, curr) => acc + curr.score, 0) / product.ratings.length).toFixed(1)
                                : 'No ratings'}
                            </div>

                            <div className="product-price">₱ {product?.price?.toFixed(2)}</div>

                            <div className="product-meta">
                                <p>Stock/s left: {product?.quantity}</p>
                                <p>Seller: {product?.seller?.sellername}</p>
                            </div>

                            <div className="product-description">
                                <h3>Description:</h3>
                                <p>{product?.description}</p>
                            </div>

                            <div className="store-info">
                                <div className="profile-icon-container">
                                    <span className="profile-icon">👤</span>
                                    <span className="store-name-container">
                                        <span className="store-name">
                                            {product?.seller?.storename || 'No Store Name Available'}
                                        </span>
                                        <a
                                            href={`/store/${product?.seller?.username}`} // Link to seller's store page
                                            className="visit-store-link"
                                        >
                                            Visit Store
                                        </a>
                                    </span>
                                </div>
                            </div>

                            <div className="quantity-section">
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)}>+</button>
                                </div>
                                <p className="total-price">Total: ₱ {(product?.price * quantity).toFixed(2)}</p>
                            </div>

                            <div className="action-buttons">
                                <button onClick={handleAddToCart} className="add-cart-btn">Add to Cart</button>
                                <button onClick={handleBuyNow} className="buy-now-btn">Buy Now</button>
                                {/* Buy Now button */}
                            </div>
                        </div>
                    </div>

                    <div className="reviews-section">
                        <div className="reviews-header">
                            <h2>Reviews</h2>
                            <button className="see-all-btn">See All Reviews →</button>
                        </div>

                        <div className="reviews-grid">
                            {product?.ratings?.slice(0, 2).map((rating, index) => (
                                <div key={index} className="review-card">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar"></div>
                                        <div className="reviewer-details">
                                            <p className="reviewer-name">{rating.customer.username}
                                                <p>{rating.ratingdate}</p>
                                            </p>
                                            <div className="review-rating">
                                                <span className="star">⭐{rating.score}</span>
                                                <span>{rating.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="review-text">{rating.ratingtext || 'No comment provided'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showWishlistModal && (
                <div className="modal-overlay" onClick={() => setShowWishlistModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Remove from Wishlist?</h3>
                        <div className="modal-buttons">
                            <button onClick={() => setShowWishlistModal(false)} className="cancel-btn">
                                Cancel
                            </button>
                            <button onClick={removeFromWishlist} className="confirm-btn">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddToCartModal && (
                <div className="modal-overlay" onClick={() => setShowAddToCartModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <p>Item Added to Cart!</p>
                    </div>
                </div>
            )}

            {showRemoveConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowRemoveConfirmModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <p>Item Removed from Wishlist!</p>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default Product;
