import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import StarRating from './StarRating';

function ReviewList() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const reviews = useSelector(state => state.reviews) || [];  // Provide default empty array
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (id) {  // Only dispatch if we have an ID
            dispatch({ type: 'FETCH_TRUCK_REVIEWS', payload: id });
        }
    }, [id, dispatch]);  // Added dispatch to dependency array

    const calculateAverageRating = () => {
        if (!Array.isArray(reviews) || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => {
            const rating = Number(review.rating) || 0;  // Convert to number and handle invalid ratings
            return acc + rating;
        }, 0);
        return (sum / reviews.length).toFixed(1);
    };

    // Calculate average rating once to avoid multiple calculations
    const averageRating = calculateAverageRating();

    return (
        <div className="reviews-container">
            <div className="reviews-summary">
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                    <StarRating rating={averageRating} />
                    <span>{averageRating} out of 5</span>
                    <p>{Array.isArray(reviews) ? reviews.length : 0} total reviews</p>
                </div>
            </div>

            <div className="reviews-list">
                {Array.isArray(reviews) && reviews.map(review => (
                    <div key={review.id || Math.random()} className="review-card">
                        <div className="review-header">
                            <StarRating rating={Number(review.rating) || 0} />
                            <span className="review-date">
                                {review.time_stamp ? new Date(review.time_stamp).toLocaleDateString() : 'No date'}
                            </span>
                        </div>
                        
                        <p className="review-comment">{review.comment || 'No comment'}</p>
                        
                        {review.photos && (
                            <div className="review-photos">
                                <img src={review.photos} alt="Review" />
                            </div>
                        )}
                        
                        <div className="review-footer">
                            <span>By: {review.username || 'Anonymous'}</span>
                            {user?.id === review.user_id && (
                                <button 
                                    onClick={() => dispatch({
                                        type: 'SET_EDIT_REVIEW',
                                        payload: review
                                    })}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewList;