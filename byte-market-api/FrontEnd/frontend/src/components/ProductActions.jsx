{/*
    wala pani, magamit ni sa product listing page, wishlist, product detail page
    add/remove wishlist
    buy now
    add to cart
    checkout
    maguba ig implement, not yet used. ok
  */}
import React, { useState } from 'react';
import axios from 'axios';
import './ProductActions.css';

function ProductActions({ product, userid, onAddToCart, onBuyNow, onWishlistToggle, isWishlisted }) {
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
    const [showRemoveFromWishlistModal, setShowRemoveFromWishlistModal] = useState(false);

    const handleAddToCart = async () => {
        onAddToCart(product);
        setShowAddToCartModal(true);
    };

    const handleBuyNow = async () => {
        onBuyNow(product);
    };

    const handleWishlistToggle = async () => {
        if (isWishlisted) {
            setShowRemoveFromWishlistModal(true);
        } else {
            await onWishlistToggle(product, false);
            setShowAddToWishlistModal(true);
        }
    };

    const removeFromWishlist = async () => {
        await onWishlistToggle(product, true);
        setShowRemoveFromWishlistModal(false);
    };

    return (
        <div className="product-actions">
            <button onClick={handleAddToCart} className="add-cart-btn">Add to Cart</button>
            <button onClick={handleBuyNow} className="buy-now-btn">Buy Now</button>
            <button
                onClick={handleWishlistToggle}
                className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
            >
                {isWishlisted ? '❤️' : '🤍'}
            </button>

            {/* Add to Cart Modal */}
            {showAddToCartModal && (
                <div className="modal-overlay" onClick={() => setShowAddToCartModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>Item Added to Cart!</p>
                    </div>
                </div>
            )}

            {/* Add to Wishlist Modal */}
            {showAddToWishlistModal && (
                <div className="modal-overlay" onClick={() => setShowAddToWishlistModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>Item Added to Wishlist!</p>
                    </div>
                </div>
            )}

            {/* Remove from Wishlist Confirmation Modal */}
            {showRemoveFromWishlistModal && (
                <div className="modal-overlay" onClick={() => setShowRemoveFromWishlistModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Remove from Wishlist?</h3>
                        <div className="modal-buttons">
                            <button onClick={() => setShowRemoveFromWishlistModal(false)} className="cancel-btn">Cancel</button>
                            <button onClick={removeFromWishlist} className="confirm-btn">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductActions;
