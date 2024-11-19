import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ReviewForm.css';

function ReviewForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    
    // Fetch trucks from Redux state
    const trucks = useSelector((state) => state.truck.allTrucks);
    const isLoadingTrucks = useSelector((state) => state.truck.loading);  // Assume you have a loading state for trucks

    // Manage form data state
    const [formData, setFormData] = useState({
        truck_id: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        // Dispatch action to fetch trucks when the form mounts
        dispatch({ type: 'FETCH_TRUCKS' });
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.truck_id || !formData.comment) {
            return;  // Prevent submission if the required fields are missing
        }

        // Dispatch ADD_REVIEW action
        dispatch({
            type: 'ADD_REVIEW',
            payload: formData
        });

        // Redirect user to the truck's page after review is posted
        history.push(`/foodtrucks/${formData.truck_id}`);
    };

    // Render loading indicator or form
    if (isLoadingTrucks) {
        return <p>Loading food trucks...</p>;
    }

    return (
        <div className="review-container">
            <form onSubmit={handleSubmit} className="review-form">
                <h2>Share Your Experience</h2>
                
                <div className="select-container">
                    <label>Select a Food Truck:</label>
                    <select
                        value={formData.truck_id}
                        onChange={(e) => setFormData({
                            ...formData,
                            truck_id: e.target.value
                        })}
                        required
                    >
                        <option value="">Choose a food truck...</option>
                        {trucks && trucks.map(truck => (
                            <option key={truck.id} value={truck.id}>
                                {truck.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rating-container">
                    <label>Rating:</label>
                    <div className="star-rating">
                        {[5,4,3,2,1].map(num => (
                            <button
                                key={num}
                                type="button"
                                className={`star-btn ${formData.rating >= num ? 'active' : ''}`}
                                onClick={() => setFormData({
                                    ...formData,
                                    rating: num
                                })}
                                aria-label={`Rate ${num} stars`}
                            >
                                <FaStar />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="comment-container">
                    <label>Your Review:</label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({
                            ...formData,
                            comment: e.target.value
                        })}
                        placeholder="Share your experience with this food truck..."
                        required
                        minLength="10" // Example: at least 10 characters for a review
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={!formData.truck_id || !formData.comment} // Disable if required fields are empty
                >
                    Post Review
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
