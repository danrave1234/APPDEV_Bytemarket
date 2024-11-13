import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ProductListing.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProductListing() {
    const { userid } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent');
    const [wishlist, setWishlist] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    // Modal states
    const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
    const [showRemoveWishlistModal, setShowRemoveWishlistModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        fetchSellers();
        fetchProducts();
        fetchWishlist();
    }, [userid, selectedSeller, searchQuery]);

    const fetchSellers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/getAllSeller');
            setSellers(response.data);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/product/getAllProduct');
            let filteredProducts = response.data;

            if (selectedSeller) {
                filteredProducts = response.data.filter(product =>
                    product.seller && product.seller.userid === parseInt(selectedSeller)
                );
            }
            if (searchQuery) {
                filteredProducts = filteredProducts.filter(product =>
                    product.productname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/getWishlistByUserId/${userid}`);
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const isProductInWishlist = (productId) => {
        return wishlist.some(item =>
            item.wishlistProducts && item.wishlistProducts.some(product =>
                product.productid === parseInt(productId)
            )
        );
    };

    const handleAddToWishlist = async (productId) => {
        try {
            const wishlistItem = {
                wishlistdate: new Date().toISOString(),
                customer: { userid: userid },
                wishlistProducts: [{ productid: parseInt(productId) }]
            };

            await axios.post('http://localhost:8080/api/wishlist/addWishlist', wishlistItem);
            await fetchWishlist();
            setShowAddToWishlistModal(true);
            setTimeout(() => setShowAddToWishlistModal(false), 2000);
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            const wishlistItemToRemove = wishlist.find(item =>
                item.wishlistProducts.some(product =>
                    product.productid === parseInt(selectedItemId)
                )
            );

            if (wishlistItemToRemove) {
                await axios.delete(`http://localhost:8080/api/wishlist/deleteWishlist/${wishlistItemToRemove.wishlistid}`);
                await fetchWishlist();
                setShowRemoveWishlistModal(false);
                setShowRemoveConfirmModal(true);
                setTimeout(() => setShowRemoveConfirmModal(false), 2000);
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async (product, event) => {
        event.stopPropagation(); // Prevent the card click handler from being triggered

        try {
            // Fetch existing cart items to check for duplicates
            const response = await axios.get('http://localhost:8080/api/cart/getAllCart');
            const userCartItems = response.data.filter(item => item.customer.userid === parseInt(userid));

            // Check if the product already exists in the cart
            const isProductInCart = userCartItems.some(cartItem => cartItem.product.productid === parseInt(product.productid));

            if (isProductInCart) {
                alert("This product is already in your cart!");
                return;
            }

            // Add the product to the cart if it is not a duplicate
            const cartItem = {
                quantity: 1,
                dateposted: new Date().toISOString(),
                customer: { userid: userid },
                product: { productid: product.productid }
            };

            await axios.post('http://localhost:8080/api/cart/addCart', cartItem);
            setShowAddToCartModal(true);
            setTimeout(() => setShowAddToCartModal(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleBuyNow = async (product, event) => {
        event.stopPropagation();
        await handleAddToCart(product, event);
        navigate('/customer/CheckOut');
    };

    const handleCardPress = (product) => {
        navigate(`/productdetail/${product.productid}`, { state: { product } });
    };

    const getSortedItems = () => {
        let sortedProducts = [...products];
        switch(sortBy) {
            case 'priceLow':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'priceHigh':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'alpha':
                return sortedProducts.sort((a, b) => a.productname.localeCompare(b.productname));
            case 'rating':
                return sortedProducts.sort((a, b) => {
                    const aRating = a.ratings?.length > 0
                        ? a.ratings.reduce((acc, curr) => acc + curr.rating, 0) / a.ratings.length
                        : 0;
                    const bRating = b.ratings?.length > 0
                        ? b.ratings.reduce((acc, curr) => acc + curr.rating, 0) / b.ratings.length
                        : 0;
                    return bRating - aRating;
                });
            case 'recent':
            default:
                return sortedProducts.sort((a, b) => new Date(b.dateposted).getTime() - new Date(a.dateposted).getTime());
        }
    };

    if (loading) return <PageLayout><div className="loading">Loading products...</div></PageLayout>;

    return (
        <PageLayout>
            <div className="product-listing-container">
                <div className="top-section">
                    <div className="store-dropdown">
                        <select
                            value={selectedSeller}
                            onChange={(e) => {
                                setSelectedSeller(e.target.value);
                                setLoading(true);
                            }}
                        >
                            <option value="">All Stores</option>
                            {sellers.map(seller => (
                                <option key={seller.userid} value={seller.userid}>
                                    {seller.storename}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sort-buttons">
                        <button
                            className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                            onClick={() => setSortBy('recent')}
                        >
                            Most Recent
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'priceLow' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceLow')}
                        >
                            Price: Low to High
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'priceHigh' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceHigh')}
                        >
                            Price: High to Low
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'alpha' ? 'active' : ''}`}
                            onClick={() => setSortBy('alpha')}
                        >
                            Alphabetical
                        </button>
                        <button
                            className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                            onClick={() => setSortBy('rating')}
                        >
                            Highest Rated
                        </button>
                    </div>
                </div>

                <div className="products-outer-container">
                    {products.length === 0 ? (
                        <p className="no-products">No products available. Start browsing!</p>
                    ) : (
                        <div className="product-listing-grid">
                            {getSortedItems().map((product) => (
                                <div
                                    className="product-card"
                                    key={product.productid}
                                    onClick={() => handleCardPress(product)}
                                >
                                    <div className="product-image">
                                        {product.image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${product.image}`}
                                                alt={product.productname}
                                            />
                                        ) : (
                                            <div className="image-placeholder">No Image Available</div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <h3 className="product-title">{product.productname}</h3>
                                        <p className="product-price">₱{product.price?.toFixed(2)}</p>
                                        <div className="product-rating">
                                            ⭐ {product.ratings?.length > 0
                                                ? (product.ratings.reduce((acc, curr) => acc + curr.rating, 0) / product.ratings.length).toFixed(1)
                                                : 'No ratings'}
                                        </div>
                                        <div className="product-actions">
                                            <button
                                                className="buy-now-btn"
                                                onClick={(e) => handleBuyNow(product, e)}
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                className="cart-btn"
                                                onClick={(e) => handleAddToCart(product, e)}
                                                title="Add to cart"
                                            >
                                                🛒
                                            </button>
                                            <span
                                                className={`wishlist-icon ${isProductInWishlist(product.productid) ? 'wishlisted' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isProductInWishlist(product.productid)) {
                                                        setSelectedItemId(product.productid);
                                                        setShowRemoveWishlistModal(true);
                                                    } else {
                                                        handleAddToWishlist(product.productid);
                                                    }
                                                }}
                                                title={isProductInWishlist(product.productid) ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                {isProductInWishlist(product.productid) ? '❤️' : '🤍'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showRemoveWishlistModal && (
                    <div className="modal-overlay" onClick={() => setShowRemoveWishlistModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Remove from Wishlist?</h3>
                            <div className="modal-buttons">
                                <button onClick={() => setShowRemoveWishlistModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button onClick={handleRemoveFromWishlist} className="confirm-btn">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddToWishlistModal && (
                    <div className="modal-overlay" onClick={() => setShowAddToWishlistModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <p>Item Added to Wishlist!</p>
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

                {showAddToCartModal && (
                    <div className="modal-overlay" onClick={() => setShowAddToCartModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <p>Item Added to Cart!</p>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}