import React from 'react';
import { Link } from 'react-router-dom';

function ReviewConfirmationPage() {
  return (
    <div className="review-confirmation">
      <h1>Review Submitted Successfully!</h1>
      <p>Thank you for your feedback.</p>
      <Link to="/Trucks" className="btn">Back to Trucks</Link>
      <Link to="/user" className="btn">View My Profile</Link>
    </div>
  );
}

export default ReviewConfirmationPage;