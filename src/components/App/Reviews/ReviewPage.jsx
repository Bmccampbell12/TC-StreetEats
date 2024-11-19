import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './ReviewPage.css'

function ReviewPage() {
    return(
        <div className= 'Review-Page'>
            <div className="review-grid">
                <div className="review-form-section">
                    <ReviewForm />
                </div>
                <div className="review-list-section">
                    <ReviewList />
                </div>
            </div>
        </div>
    )
}
export default ReviewPage;