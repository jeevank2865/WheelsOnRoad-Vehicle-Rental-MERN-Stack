import React, { useState } from 'react';
import axios from 'axios';
import { Star, ThumbsUp } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const VehicleReviews = ({ vehicle, user, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!vehicle) return null;
  const reviews = vehicle.reviews || [];
  const avgRating = vehicle.averageRating || 0;
  const reviewCount = vehicle.reviewCount || reviews.length || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { setError('Please write a review comment.'); return; }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_URL}/vehicles/${vehicle._id}/reviews`, {
        userName: user?.name || 'Verified Rider',
        userEmail: user?.email,
        rating,
        comment
      });
      setSuccess('✅ Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
      <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '22px' }}>
        ⭐ Customer Reviews
      </h3>

      {/* Rating Overview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: '#20242B', borderRadius: '14px', padding: '20px', marginBottom: '24px', border: '1px solid #2D333F' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#E08E45', lineHeight: 1 }}>
            {Number(avgRating).toFixed(1)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '6px 0' }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} fill={i <= Math.round(avgRating) ? '#E08E45' : 'transparent'} color={i <= Math.round(avgRating) ? '#E08E45' : '#64748B'} />
            ))}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Based on {reviewCount} reviews</div>
        </div>

        <div style={{ flex: 1 }}>
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length;
            const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', width: '14px' }}>{star}</span>
                <Star size={11} fill="#E08E45" color="#E08E45" />
                <div style={{ flex: 1, height: '6px', backgroundColor: '#2D333F', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#E08E45', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', width: '20px' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.slice().reverse().slice(0, 5).map((rev, idx) => (
            <div key={idx} style={{ backgroundColor: '#20242B', border: '1px solid #2D333F', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(224,142,69,0.15)', border: '1px solid rgba(224,142,69,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E08E45', fontWeight: '700', fontSize: '0.9rem' }}>
                    {(rev.userName || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '0.92rem' }}>{rev.userName || 'Verified Rider'}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{formatDate(rev.date)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={13} fill={i <= rev.rating ? '#E08E45' : 'transparent'} color={i <= rev.rating ? '#E08E45' : '#64748B'} />
                  ))}
                </div>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>"{rev.comment}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px', color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
          Be the first to review this vehicle!
        </div>
      )}

      {/* Write Review Form */}
      {user ? (
        <div style={{ backgroundColor: '#20242B', border: '1px solid #2D333F', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '14px' }}>Write a Review</div>
          
          {/* Star Rating Picker */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '8px' }}>YOUR RATING</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={28}
                  fill={i <= (hoverRating || rating) ? '#E08E45' : 'transparent'}
                  color={i <= (hoverRating || rating) ? '#E08E45' : '#2D333F'}
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                />
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this vehicle..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#181B20',
              border: '1px solid #2D333F',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              resize: 'vertical',
              fontFamily: 'Outfit, sans-serif',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
          />

          {error && <div style={{ color: '#FF2E54', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: '#00FF88', fontSize: '0.8rem', marginBottom: '10px' }}>{success}</div>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#E08E45',
              color: '#0F1115',
              fontWeight: '700',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(224,142,69,0.06)', border: '1px solid rgba(224,142,69,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: '0.88rem' }}>
          Please <strong style={{ color: '#E08E45' }}>log in</strong> to leave a review.
        </div>
      )}
    </div>
  );
};
