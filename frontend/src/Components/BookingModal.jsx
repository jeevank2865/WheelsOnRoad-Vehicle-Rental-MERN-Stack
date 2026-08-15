import React, { useState, useContext } from 'react';
import { ApexContext } from '../Context/ApexContext';
import { calculateRentalCostClient } from '../utils/pricingUtils';
import { X, Calendar, AlertTriangle, CheckCircle, Zap, Shield } from 'lucide-react';

const BIKE_FALLBACK = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop';
const CAR_FALLBACK  = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop';

export const BookingModal = ({ vehicle, onClose }) => {
  const { createBooking, checkAvailability, user } = useContext(ApexContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [pricingPreview, setPricingPreview] = useState(null);
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const isBike = vehicle?.vehicleType === 'Superbike';
  const fallback = isBike ? BIKE_FALLBACK : CAR_FALLBACK;
  const vehicleImage = vehicle?.images && vehicle.images[0] ? vehicle.images[0] : fallback;

  const handleCheckDates = async () => {
    if (!startDate || !endDate) return;
    setChecking(true);
    setError('');
    try {
      const result = await checkAvailability(vehicle._id, startDate, endDate);
      setAvailability(result.available);
      if (result.available) {
        const preview = calculateRentalCostClient(vehicle, startDate, endDate);
        setPricingPreview(preview);
      }
    } catch (e) {
      setError('Unable to check availability.');
    } finally {
      setChecking(false);
    }
  };

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value);
    setAvailability(null);
    setPricingPreview(null);
  };

  const handleBook = async () => {
    if (!user) { setError('Please sign in to make a reservation.'); return; }
    setBooking(true);
    setError('');
    try {
      await createBooking(vehicle._id, startDate, endDate);
      setConfirmed(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Reservation failed. Dates may already be taken.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '20px', width: '100%', maxWidth: '520px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        {/* Hero Image - exact match with VehicleCard */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img
            src={vehicleImage}
            alt={vehicle.title}
            onError={(e) => { e.target.src = fallback; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181B20 10%, transparent 60%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid #2D333F', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
            <span className="badge-cc" style={{ marginBottom: '6px', display: 'inline-block' }}>{vehicle.category}</span>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>{vehicle.title}</h3>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(0,240,255,0.1)', border: '2px solid #00F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={30} color="#00F0FF" />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Reservation Confirmed!</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '20px' }}>
                {vehicle.title} is locked for your dates.<br />Total Charged: <strong style={{ color: '#00F0FF' }}>${pricingPreview?.totalCost}</strong>
              </p>
              <button onClick={onClose} style={{ background: 'linear-gradient(135deg, #00F0FF, #0099CC)', color: '#0F1115', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                View My Bookings
              </button>
            </div>
          ) : (
            <>
              {/* Date Rate Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#20242B', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Weekday Rate</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>${vehicle.dailyRate}<span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '400' }}>/day</span></div>
                </div>
                <div style={{ backgroundColor: '#20242B', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Weekend Surge</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FF2E54', fontFamily: 'Outfit, sans-serif' }}>${vehicle.weekendSurgeRate}<span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '400' }}>/day</span></div>
                </div>
              </div>

              {/* Date Pickers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Calendar size={12} style={{ marginRight: '4px' }} /> Pick-Up Date
                  </label>
                  <input type="date" min={today} value={startDate} onChange={handleDateChange(setStartDate)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Calendar size={12} style={{ marginRight: '4px' }} /> Return Date
                  </label>
                  <input type="date" min={startDate || today} value={endDate} onChange={handleDateChange(setEndDate)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Check Availability Button */}
              <button onClick={handleCheckDates} disabled={!startDate || !endDate || checking} style={{ width: '100%', backgroundColor: '#20242B', border: '1px solid #2D333F', color: '#94A3B8', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', marginBottom: '12px', opacity: (!startDate || !endDate) ? 0.5 : 1 }}>
                {checking ? '⏳ Checking live availability...' : '🔍 Check Availability & Calculate Cost'}
              </button>

              {/* Availability Result */}
              {availability === false && (
                <div style={{ background: 'rgba(255,46,84,0.1)', border: '1px solid rgba(255,46,84,0.35)', color: '#FF6B6B', padding: '12px 16px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> Vehicle already reserved for selected dates. Please try different dates.
                </div>
              )}

              {/* Pricing Preview */}
              {pricingPreview && availability && (
                <div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: '#94A3B8' }}>
                    <span>Rental Duration</span>
                    <span style={{ color: '#FFF', fontWeight: '600' }}>{pricingPreview.totalDays} days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: '#94A3B8' }}>
                    <span>Security Deposit</span>
                    <span style={{ color: '#FFF', fontWeight: '600' }}>${vehicle.securityDeposit}</span>
                  </div>
                  {pricingPreview.totalDays >= 7 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: '#00F0FF' }}>
                      <span>Multi-Day Discount (7+ days)</span>
                      <span style={{ fontWeight: '700' }}>-10% Applied ✓</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid #2D333F', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                    <span style={{ color: '#FFF' }}>Total Rental Cost</span>
                    <span style={{ color: '#00F0FF' }}>${pricingPreview.totalCost}</span>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(255,46,84,0.1)', border: '1px solid rgba(255,46,84,0.35)', color: '#FF6B6B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {error}
                </div>
              )}

              {/* Security Deposit Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '14px' }}>
                <Shield size={14} color="#00F0FF" />
                Refundable security deposit: <strong style={{ color: '#FFF' }}>${vehicle.securityDeposit}</strong> — returned within 48hrs after completed rental.
              </div>

              {/* Confirm Booking Button */}
              <button onClick={handleBook} disabled={!availability || booking} style={{ width: '100%', background: availability ? 'linear-gradient(135deg, #00F0FF, #0099CC)' : '#2D333F', color: availability ? '#0F1115' : '#555', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: availability ? 'pointer' : 'not-allowed', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Zap size={18} /> {booking ? 'Processing Reservation...' : 'Confirm & Lock Reservation'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
