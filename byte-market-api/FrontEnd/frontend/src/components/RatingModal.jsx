import React, { useState } from 'react';
import './RatingModal.css';

const RatingModal = ({ showModal, onClose, onSubmit, productName }) => {
    const [ratingScore, setRatingScore] = useState(1); // Start at 1
    const [ratingText, setRatingText] = useState('');

    // Handles setting the rating score by clicking stars
    const handleStarHover = (index) => {
        setRatingScore(index + 1); // Update score based on hover position
    };

    const handleStarClick = (index) => {
        setRatingScore(index + 1); // Set score permanently on click
    };


    // Handles review text change
    const handleTextChange = (e) => {
        setRatingText(e.target.value);
    };

    const handleSubmit = () => {
        if (!ratingScore || !ratingText) {
            alert('Please provide both a score and a review text.');
            return;
        }

        onSubmit(ratingScore, ratingText); // Pass both values here
    };



    // Prevents closing the modal when the user clicks on the modal content
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={`rating-modal ${showModal ? 'show' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h4>Rate Product: {productName}</h4>
                <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            className={`star ${index < ratingScore ? 'gold' : ''}`}
                            onMouseEnter={() => handleStarHover(index)}
                            onClick={() => handleStarClick(index)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <label>Review:</label>
                <textarea
                    value={ratingText}
                    onChange={handleTextChange}
                />
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Submit Rating</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
