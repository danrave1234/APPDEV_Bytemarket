import './styles/Reviews.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Reviews() {
    const { userid } = useAuth();
    const { productid } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const navigate = useNavigate(); // For navigation to go back

    useEffect(() => {
        fetchProduct();
    }, [productid]);

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

    if (loading) return (
        <PageLayout>
            <div className="container">
                <div className="loading">Loading...</div>
            </div>
        </PageLayout>
    );

    // Check if there are any ratings
    const totalReviews = product?.ratings?.length || 0;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = product?.ratings?.slice(indexOfFirstReview, indexOfLastReview) || [];

    // Ensure currentPage is within the valid range
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Check if the current user has reviewed this product
    const userReview = product?.ratings?.find(rating => rating.customer.userid === userid);

    return (
        <PageLayout>
            <div className="container">
                <div className="reviews-page">
                    <div className="product-summary">
                        <div className="product-image-container">
                            <img
                                src={`data:image/jpeg;base64,${product?.image}`}
                                alt={product?.productname}
                                className="product-image"
                            />
                        </div>
                        <div className="product-details">
                            <h1>{product?.productname}</h1>
                            <div className="average-rating">
                                <span className="star">⭐</span>
                                <span>{product?.ratings?.length > 0
                                    ? (product.ratings.reduce((acc, curr) => acc + curr.score, 0) / product.ratings.length).toFixed(1)
                                    : 'No ratings yet'
                                }</span>
                                <span className="total-reviews">({totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>


                    <div className="reviews-section">
                        <h2 className="reviews-title">Reviews</h2>
                    <hr className="divider" />

                        {/* Display user review first if available */}


                        {/* If there are no reviews */}
                        {totalReviews === 0 ? (
                            <div className="no-reviews">No reviews yet.</div>
                        ) : (
                            currentReviews.map((rating, index) => (
                                <div key={index} className="review-card">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">👤</div>
                                        <div className="reviewer-details">
                                            <p className="reviewer-name">{rating.customer.username}</p>
                                            <p className="review-date">{rating.ratingdate}</p>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <span className="star">⭐ {rating.score.toFixed(1)}</span>
                                    </div>
                                    <p className="review-text">{rating.ratingtext || 'No comment provided'}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                &lt;
                            </button>
                            <span className="page-number">{currentPage}</span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                &gt;
                            </button>
                        </div>
                    )}

                    {/* Go Back Button */}
                    <button className="go-back-button" onClick={() => navigate(`/productdetail/${productid}`)}>
                        Go Back to Product Info
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}

export default Reviews;
