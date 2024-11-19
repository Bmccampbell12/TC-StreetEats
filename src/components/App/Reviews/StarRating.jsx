import React from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css'

const StarRating = ({ rating }) => {
    return (
        <div className="star-display">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                key={star}
                className={`star ${star <= rating ? 'filled' : 'empty'}`}
                color={star <= rating ? "#ffc107" : "#e4e5e9"}
                size={20}
                />
            ))}
        </div>
    )
};

export default StarRating;