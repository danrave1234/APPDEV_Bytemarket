import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "./components/AuthProvider.jsx";
import PageLayout from "./components/Layout.jsx";
// import { Star } from "lucide-react";

const Rating = () => {
    const { userid } = useAuth();
    const [product, setProduct] = useState(null);
    const [productId, setProductId] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/product/getProductById/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!product) return;

        try {
            const ratingData = {
                score: rating,
                ratingtext: reviewText,
                customer: { userid: userid },
                product: { productid: product.productid }
            };

            await axios.post('http://localhost:8080/api/rating/addRating', ratingData);
            setShowSuccessModal(true);
            setReviewText('');
            setRating(5);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <PageLayout>
            <div className="wishlist-container">
                <div className="products-outer-container">
                    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Write Review</h2>

                        {/* Test Area - Product Selection */}
                        <div className="mb-6 flex gap-4">
                            <input
                                type="text"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                placeholder="Enter Product ID"
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() => fetchProduct(productId)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Load Product
                            </button>
                        </div>

                        {product && (
                            <div className="mb-6">
                                <h3 className="font-bold">Product: {product.productname}</h3>
                                <p className="text-gray-600">Price: ${product.price}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmitRating} className="space-y-6">
                            <div>
                                <label className="block mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRating(value)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full p-2 border rounded min-h-32"
                                    placeholder="Write your review here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!product}
                                className="w-full py-2 bg-pink-400 text-white rounded hover:bg-pink-500 disabled:bg-gray-300"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>

                {showSuccessModal && (
                    <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <p>Review submitted successfully!</p>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Rating;