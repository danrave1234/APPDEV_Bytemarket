import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import './styles/StorePage.css';
import OrderProductModal from './components/OrderProductModal.jsx';


function StorePage() {
    const { userid: customerId } = useAuth();
    const { userid: sellerId } = useParams();
    const navigate = useNavigate();

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [modalItems, setModalItems] = useState([]);

// Function to open the modal
    const openOrderModal = (item) => {
        const formattedItems = [
            {
                productid: item.productid,
                productname: item.productname,
                price: item.price,
                quantity: 1, // Default quantity for Buy Now
                image: item.image,
                seller: item.seller, // Ensure the seller is passed
            },
        ];
        setModalItems(formattedItems);
        setShowOrderModal(true);
    };

// Function to close the modal
    const closeOrderModal = () => {
        setShowOrderModal(false);
        setModalItems([]);
    };

    // State management
    const [storeDetails, setStoreDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent');
    const [wishlist, setWishlist] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');

    // Modal states
    const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
    const [showRemoveWishlistModal, setShowRemoveWishlistModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // Fetch store details and products
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const [sellerResponse, productsResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/seller/getSellerById/${sellerId}`),
                    axios.get('http://localhost:8080/api/product/getAllProduct')
                ]);

                setStoreDetails(sellerResponse.data);
                setSelectedSeller(sellerId);

                // Filter products for this store
                const storeProducts = productsResponse.data.filter(
                    product => product.seller && product.seller.userid === parseInt(sellerId)
                );
                setProducts(storeProducts);

            } catch (error) {
                console.error('Error fetching store data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
        fetchWishlist();
        fetchSellers();
    }, [sellerId, customerId]);

    const fetchSellers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/getAllSeller');
            setSellers(response.data);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/getWishlistByUserId/${customerId}`);
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    // Calculate store rating
    const calculateStoreRating = () => {
        if (!products.length) return 'No ratings';

        let totalRating = 0;
        let ratedProducts = 0;

        products.forEach(product => {
            if (product.ratings && product.ratings.length > 0) {
                totalRating += product.ratings.reduce((acc, curr) => acc + curr.score, 0) / product.ratings.length;
                ratedProducts++;
            }
        });

        return ratedProducts > 0 ? (totalRating / ratedProducts).toFixed(1) : 'No ratings';
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
                customer: { userid: customerId },
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
        event.stopPropagation();

        try {
            // Fetch existing cart items
            const response = await axios.get('http://localhost:8080/api/cart/getAllCart');
            const userCartItems = response.data.filter(item => item.customer.userid === parseInt(customerId));

            // Check if the product is already in the cart
            const isProductInCart = userCartItems.some(cartItem => cartItem.product.productid === parseInt(product.productid));

            if (isProductInCart) {
                alert("This product is already in your cart!");
                return;
            }

            // Add the product to the cart if not a duplicate
            const cartItem = {
                quantity: 1,
                dateposted: new Date().toISOString(),
                customer: { userid: customerId },
                product: { productid: product.productid }
            };

            await axios.post('http://localhost:8080/api/cart/addCart', cartItem);
            setShowAddToCartModal(true);
            setTimeout(() => setShowAddToCartModal(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleBuyNow = (product, event) => {
        event.stopPropagation(); // Prevent parent click events
        openOrderModal(product);
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
                        ? a.ratings.reduce((acc, curr) => acc + curr.score, 0) / a.ratings.length
                        : 0;
                    const bRating = b.ratings?.length > 0
                        ? b.ratings.reduce((acc, curr) => acc + curr.score, 0) / b.ratings.length
                        : 0;
                    return bRating - aRating;
                });
            case 'recent':
            default:
                return sortedProducts.sort((a, b) => new Date(b.dateposted).getTime() - new Date(a.dateposted).getTime());
        }
    };

    if (loading) return <PageLayout><div className="loading">Loading store details...</div></PageLayout>;

    return (
        <PageLayout>
            <div className="store-page-container">
                {/* Store Information Section */}
                <div className="store-info-container">
                    <div className="store-profile-image">
                        <img
                            src={`data:image/jpeg;base64,${storeDetails?.storeimage}`} alt={storeDetails?.storename}/>
                    </div>
                    <div className="store-details">
                        <h1>{storeDetails?.storename}</h1>
                        <div className="store-rating">
                            ⭐ {calculateStoreRating()}
                        </div>
                        <p>Products Listed: {products.length}</p>
                        <p className="store-description">About shop: Store description goes here</p>
                    </div>
                </div>

                {/* Store Selector Section */}
                <div className="store-selector">
                    <label>Visit Other Stores:</label>
                    <select
                        value={selectedSeller}
                        onChange={(e) => {
                            setSelectedSeller(e.target.value);
                            navigate(`/store/${e.target.value}`);
                        }}
                    >
                        {sellers.map(seller => (
                            <option key={seller.userid} value={seller.userid}>
                                {seller.storename}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sorting Section */}
                <div className="sort-buttons">
                    <button
                        className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                        onClick={() => setSortBy('recent')}
                    >
                        Recently Added
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

                {/* Products Grid */}
                <div className="products-container">
                    {products.length === 0 ? (
                        <p className="no-products">No products available in this store.</p>
                    ) : (
                        <div className="products-grid">
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
                                        <h3
                                            className="product-title"
                                            title={product.productname}
                                        >
                                            {product.productname.length > 30
                                                ? `${product.productname.slice(0, 30)}...`
                                                : product.productname}
                                        </h3>
                                        <p className="product-price">₱{product.price?.toFixed(2)}</p>
                                        <div className="product-rating">
                                            ⭐ {product.ratings?.length > 0
                                                ? (product.ratings.reduce((acc, curr) => acc + curr.score, 0) / product.ratings.length).toFixed(1)
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
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>Item Added to Wishlist!</p>
                        </div>
                    </div>
                )}

                {showRemoveConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>Item Removed from Wishlist!</p>
                        </div>
                    </div>
                )}

                {showAddToCartModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>Item Added to Cart!</p>
                        </div>
                    </div>
                )}
            </div>

            {showOrderModal && (
                <OrderProductModal
                    show={showOrderModal}
                    selectedProducts={modalItems}
                    onClose={closeOrderModal}
                />
            )}

        </PageLayout>
    );
}

export default StorePage;