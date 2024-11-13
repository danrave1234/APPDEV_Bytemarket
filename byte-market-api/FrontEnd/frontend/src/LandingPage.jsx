import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/LandingPage.css';
import logoNiAndri from './assets/logoNiAndri.png';
import ph1 from './assets/placeholderDan.png';
import ph2 from './assets/placeholder2.png';
import ph3 from './assets/placeholder3.png';
import PageLayout from './components/Layout.jsx';
import { useAuth } from './components/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [slideIndex, setSlideIndex] = useState(0);
    const { userid } = useAuth();
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

    const fetchSellers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/getAllSeller');
            const shuffledSellers = response.data.sort(() => 0.5 - Math.random());
            setSellers(shuffledSellers);
            setDisplayedSellers(shuffledSellers.slice(0, sellersPerPage));

            // Fetch products for each seller
            const productsMap = {};
            for (const seller of shuffledSellers) {
                const products = await fetchSellerProducts(seller.userid);
                productsMap[seller.userid] = products;
            }
            setSellerProducts(productsMap);
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


    const handleBuyNow = async (product, event) => {
        event.stopPropagation();
        await handleAddToCart(product, event);
        navigate('/customer/CheckOut');
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
                    <button className="previous" onClick={prevSlide}>‹</button>
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
                    <button className="next" onClick={nextSlide}>›</button>
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
                                                        <h2 className="store-name" onClick={() => navigateToStore(seller.userid)}>
                                                            {seller.storename}
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
                                                                            {/* ... (existing code) */}
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

                {/* Footer Grid */}
                <div className="grid-container">
                    {["Danrave Keh", "Vincent Pacaña", "Andri Apas", "Judiel Oppura", "Josemar Pajares", "Sir Busico"].map((name, index) => (
                        <div className="grid-item" key={index}>{name}</div>
                    ))}
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

export default LandingPage;