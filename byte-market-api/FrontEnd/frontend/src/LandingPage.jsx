import { useEffect, useState } from 'react';
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
    const { userid, role } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
    const [showRemoveWishlistModal, setShowRemoveWishlistModal] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

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
        fetchProducts();
        if (userid) {
            fetchWishlist();
        }
        return () => clearInterval(interval);
    }, [slides.length, userid]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/product/getAllProduct');
            const sortedItems = response.data.sort((a, b) =>
                new Date(b.dateposted).getTime() - new Date(a.dateposted).getTime()
            );
            // Only get the first 8 products for the landing page
            setProducts(sortedItems.slice(0, 8));
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
        event.stopPropagation();

        try {
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

    const nextSlide = () => setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    const prevSlide = () => setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    const goToSlide = (index) => setSlideIndex(index);

    return (
        <PageLayout>
            <div className="landing-container">
                <div className="cta-container">
                    <button
                        className="cta-button"
                        onClick={() => navigate('/productlisting')}
                    >
                        Go to Product Listing
                    </button>
                </div>

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

                {/* Featured Products Section */}
                {/* for testing have a drop down for stores name here. */}
                <div className="featured-products-section">
                    <h2>Featured Products</h2>
                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <div
                                    className="product-card"
                                    key={product.productid}
                                    onClick={() => handleCardPress(product)}
                                >
                                    <div className="product-image">
                                        {product.image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`}
                                                alt={product.productname}
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                No Image Available
                                            </div>
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

                <div className="grid-container">
                    {["Danrave Keh", "Vincent Pacaña", "Andre Apas", "Judiel Oppura", "Josemar Pajares", "Sir Busico"].map((name, index) => (
                        <div className="grid-item" key={index}>{name}</div>
                    ))}
                    {Array(6).fill("Pic/prgraph Placeholders").map((text, index) => (
                        <div key={index} className="grid-item waw-item">{text}</div>
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









