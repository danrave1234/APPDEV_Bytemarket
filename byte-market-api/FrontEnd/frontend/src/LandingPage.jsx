import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/LandingPage.css';
import logoNiAndri from './assets/ByteMarketBanner4.png';
import ph1 from './assets/ByteMarketBannerWhite.png';
import ph2 from './assets/ByteMarketBanner2.png';
import ph3 from './assets/ByteMarketBanner3.png';
import PageLayout from './components/Layout.jsx';
import OrderProductModal from './components/OrderProductModal.jsx';
import { useAuth } from './components/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';
import LoginModal from "./components/LoginModal.jsx";

function LandingPage() {
    const [slideIndex, setSlideIndex] = useState(0);
    const { userid, role, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [displayedSellers, setDisplayedSellers] = useState([]);
    const [sellerProducts, setSellerProducts] = useState({});
    const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
    const [showRemoveWishlistModal, setShowRemoveWishlistModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const sellersPerPage = 3;
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [showRoleMismatchModal, setShowRoleMismatchModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);

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
        document.body.style.overflow = 'hidden';
        setModalItems(formattedItems);
        setShowOrderModal(true);
    };

// Function to close the modal
    const closeOrderModal = () => {
        document.body.style.overflow = 'auto';
        setShowOrderModal(false);
        setModalItems([]);
    };

    const slides = [
        { src: ph1, alt: "Placeholder 1" },
        { src: ph2, alt: "Placeholder 2" },
        { src: ph3, alt: "Placeholder 3" },
        { src: logoNiAndri, alt: "Logo Ni Andri" },
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000);
        fetchSellers();
        if (userid) {
            fetchWishlist();
        }
        return () => clearInterval(interval);
    }, [slides.length, userid]);
    useEffect(() => {
        if (showRoleMismatchModal) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
    }, [showRoleMismatchModal]);

    const fetchSellers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/getAllSeller');
            const shuffledSellers = response.data.sort(() => 0.5 - Math.random());
            setSellers(shuffledSellers);
            setDisplayedSellers(shuffledSellers.slice(0, sellersPerPage));

            // Fetch all products in parallel
            const productsMap = await Promise.all(
                shuffledSellers.map(async (seller) => {
                    const products = await fetchSellerProducts(seller.userid);
                    return { sellerId: seller.userid, products };
                })
            );

            // Transform result into a seller-products map
            const productsBySeller = productsMap.reduce((acc, { sellerId, products }) => {
                acc[sellerId] = products;
                return acc;
            }, {});
            setSellerProducts(productsBySeller);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellerProducts = async (sellerId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/product/getAllProduct');
            const sellerProducts = response.data.filter(product =>
                product.seller && product.seller.userid === sellerId
            );
            // Shuffle and get only 4 products
            return sellerProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
        } catch (error) {
            console.error('Error fetching seller products:', error);
            return [];
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

    const handleRoleMismatch = (event) => {
        event.stopPropagation();
        setShowRoleMismatchModal(true);
    }
    const loadMoreSellers = () => {
        const currentLength = displayedSellers.length;
        const nextSellers = sellers.slice(currentLength, currentLength + sellersPerPage);
        setDisplayedSellers([...displayedSellers, ...nextSellers]);
    };

    const isProductInWishlist = (productId) => {
        return wishlist.some(item =>
            item.wishlistProducts && item.wishlistProducts.some(product =>
                product.productid === parseInt(productId)
            )
        );
    };

    const handleAddToWishlist = async (productId) => {
        if(isLoggedIn === false){
            setShowLoginModal(true);
            return;
        }
        if(role!=="Customer" && isLoggedIn === true){
            handleRoleMismatch(event);
            return;
        }
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
        if(isLoggedIn === false){
            setShowLoginModal(true);
            return;
        }
        if(role!=="Customer" && isLoggedIn === true){
            handleRoleMismatch(event);
            return;
        }
        try {
            // Fetch existing cart items to check for duplicates
            const response = await axios.get('http://localhost:8080/api/cart/getAllCart');
            const userCartItems = response.data.filter(item => item.customer.userid === parseInt(userid));

            const isProductInCart = userCartItems.some(cartItem => cartItem.product.productid === parseInt(product.productid));

            if (isProductInCart) {
                alert("This product is already in your cart!");
                return;
            }

            // Add the product to the cart if it's not a duplicate
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


    const handleBuyNow = (product, event) => {
        event.stopPropagation(); // Prevent parent click events
        if(isLoggedIn === false){
            setShowLoginModal(true);
            return;
        }
        if(role!=="Customer" && isLoggedIn === true){
            handleRoleMismatch(event);
            return
        }
        openOrderModal(product);
    };


    const handleCardPress = (product) => {
        navigate(`/productdetail/${product.productid}`, { state: { product } });
    };

    const navigateToStore = (sellerId) => {
        navigate(`/store/${sellerId}`);
    };

    const nextSlide = () => setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    const prevSlide = () => setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    const goToSlide = (index) => setSlideIndex(index);

    return (
        <PageLayout>
            <div className="landing-container">
                <div className="slideshow-container">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${slideIndex === index ? "active" : ""}`}
                            style={{
                                backgroundImage: `url(${slide.src})`,
                            }}
                            aria-label={slide.alt}
                        />
                    ))}
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${slideIndex === index ? "active" : ""}`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Stores Section */}
                <h1
                   className="section-store-name">ByteMarket Store/s
                </h1>
                <div className="stores-section">
                    {loading ? (
                        <div className="loading">Loading stores...</div>
                    ) : (
                        <>
                            {displayedSellers.map((seller) => {
                                const products = sellerProducts[seller.userid] || [];
                                if (products.length === 0) return null; // Don't display store if no products
                                return (
                                    <div key={seller.userid} className="store-container">
                                        <h2 className="store-name">
                                            <u className="store-name-text" onClick={() => navigateToStore(seller.userid)}>{seller.storename}</u>
                                        </h2>
                                        <div className="store-products">
                                            {products.map((product) => (
                                                <div
                                                    className="product-cards"
                                                    key={product.productid}
                                                    onClick={() => handleCardPress(product)}
                                                >
                                                    <div className="product-image">
                                                        {product.image ? (
                                                            <img
                                                                src={`data:image/jpeg;base64,${product.image}`}
                                                                alt={product.productname}
                                                                className="preview-img"
                                                            />
                                                        ) : (
                                                            <div className="image-placeholder">
                                                                No Image Available
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="product-details">
                                                        <h3 className="product-title" title={product.productname}>
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
                                    </div>
                                );
                            })}
                            {displayedSellers.length < sellers.length && (
                                <button className="show-more-btn" onClick={loadMoreSellers}>
                                    Show More Stores
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Modals */}
                {showRemoveWishlistModal && (
                    <div className="modal-overlay" onClick={() => setShowRemoveWishlistModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Remove from Wishlist?</h3>
                            <div className="modal-buttons">
                                <button onClick={handleRemoveFromWishlist} className="confirm-btn">
                                    Confirm
                                </button>
                                <button onClick={() => setShowRemoveWishlistModal(false)} className="cancel-btn">
                                    Cancel
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

                {showOrderModal && (
                    <OrderProductModal
                        show={showOrderModal}
                        selectedProducts={modalItems}
                        onClose={closeOrderModal}
                    />
                )}
                {showRoleMismatchModal && (
                    <div className="modal-overlay-role-mismatch" onClick={() => setShowRoleMismatchModal(false)}>
                        <div className="modal-content-role-mismatch" onClick={(e) => e.stopPropagation()}>
                            <h3>Action Not Allowed</h3>
                            <p>Only customers can perform this action.</p>
                            <button onClick={() => setShowRoleMismatchModal(false)} className="close-btn-role-mismatch">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            {showLoginModal && (
                <LoginModal show={showLoginModal} closeModal={() => setShowLoginModal(false)} toggleDropdown={toggleDropdown} />
            )}
            </div>
        </PageLayout>
    );
}

export default LandingPage;