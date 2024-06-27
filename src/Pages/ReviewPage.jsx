import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import '../styles/ReviewPage.css';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const maxCharacters = 400;
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    const input = event.target.value;
    if (input.length <= maxCharacters) {
      setComment(input);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    if (email && rating) {
        try {
          const response = await fetch("http://10.1.82.57:3001/reviews/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, rating, comment, reservationId }),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Review submitted successfully:', data);
          // Handle successful submission (e.g., show a success message, clear the form)
        } catch (error) {
          console.error('Error submitting review:', error);
          // Handle error (e.g., show an error message to the user)
        }
      } else {
        alert("Please provide both email and rating.");
      }
    };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Terrible';
      case 2: return 'Bad';
      case 3: return 'Okay';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div>
      <Navbar />
      <div className="review-page">
        <h1>Leave a Review</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
          <div className="rating-section">
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="star"
                  onClick={() => handleRatingChange(star)}
                >
                  {star <= rating ? (
                    <StarIcon className="star-filled" />
                  ) : (
                    <StarBorderIcon className="star-empty" />
                  )}
                </span>
              ))}
            </div>
            <div className="rating-text">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''} - ${getRatingText(rating)}` : 'Please select a rating'}
            </div>
          </div>
          <div className="comment-section">
            <h2>How was your overall Experience?</h2>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write your comment here..."
              rows="5"
              maxLength={maxCharacters}
            ></textarea>
            <div className="character-count">
              {comment.length}/{maxCharacters} characters
            </div>
          </div>
          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;