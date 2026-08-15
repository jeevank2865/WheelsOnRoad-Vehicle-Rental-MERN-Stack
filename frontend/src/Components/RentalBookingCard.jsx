import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// Format number as Indian currency string
const formatINR = (n) => Number(n).toLocaleString('en-IN');

// Calculate rental breakdown day-by-day
function calcRentalBreakdown(pickupDt, returnDt, weekdayRate, weekendRate) {
  const result = { weekdays: 0, weekends: 0, totalDays: 0, weekdayCharge: 0, weekendCharge: 0, totalRental: 0 };
  if (!pickupDt || !returnDt || returnDt <= pickupDt) return result;

  let cur = new Date(pickupDt);
  while (cur < returnDt) {
    const day = cur.getDay(); // 0=Sun,6=Sat
    if (day === 0 || day === 6) {
      result.weekends++;
      result.weekendCharge += weekendRate;
    } else {
      result.weekdays++;
      result.weekdayCharge += weekdayRate;
    }
    result.totalDays++;
    cur.setDate(cur.getDate() + 1);
  }
  result.totalRental = result.weekdayCharge + result.weekendCharge;
  return result;
}

export const RentalBookingCard = ({ vehicle, user, onConfirm }) => {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');
  const [availability, setAvailability] = useState(null); // null | {available, message}
  const [checking, setChecking] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dateError, setDateError] = useState('');

  const weekdayRate = vehicle?.weekdayRate || vehicle?.dailyRate || 0;
  const weekendRate = vehicle?.weekendRate || vehicle?.weekendSurgeRate || weekdayRate;
  const deposit = vehicle?.securityDeposit || 0;

  const todayStr = new Date().toISOString().split('T')[0];

  const validateDates = () => {
    setDateError('');
    if (!pickupDate || !returnDate) { setDateError('Please select both pickup and return dates.'); return null; }
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const ret = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();
    if (pickup < now) { setDateError('Pickup date cannot be in the past.'); return null; }
    if (ret <= pickup) { setDateError('Return date/time must be after pickup date/time.'); return null; }
    return { pickup, ret };
  };

  const handleCheckAvailability = async () => {
    const dates = validateDates();
    if (!dates) return;
    setChecking(true);
    setAvailability(null);
    setBreakdown(null);
    try {
      const res = await axios.post(`${API_URL}/vehicles/${vehicle._id}/check-availability`, {
        startDate: dates.pickup.toISOString(),
        endDate: dates.ret.toISOString()
      });
      setAvailability(res.data);
      if (res.data.available) {
        const bd = calcRentalBreakdown(dates.pickup, dates.ret, weekdayRate, weekendRate);
        setBreakdown(bd);
      }
    } catch {
      setAvailability({ available: false, message: 'Unable to check availability. Please try again.' });
    } finally {
      setChecking(false);
    }
  };

  const canConfirm =
    availability?.available &&
    breakdown &&
    termsAccepted &&
    user;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      breakdown,
      weekdayRate,
      weekendRate,
      deposit,
      pickup: new Date(`${pickupDate}T${pickupTime}`).toISOString(),
      ret: new Date(`${returnDate}T${returnTime}`).toISOString()
    });
  };

  const totalPayable = breakdown ? breakdown.totalRental + deposit : 0;

  return (
    <div
      style={{
        backgroundColor: '#181B20',
        border: '1px solid #2D333F',
        borderRadius: '20px',
        padding: '28px',
        position: 'sticky',
        top: '100px'
      }}
    >
      {/* Price Header */}
      <div style={{ marginBottom: '22px', borderBottom: '1px solid #2D333F', paddingBottom: '18px' }}>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#E08E45', fontFamily: 'Outfit, sans-serif' }}>
          ₹{formatINR(weekdayRate)}
          <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#94A3B8' }}>/weekday</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
          Weekend: ₹{formatINR(weekendRate)}/day &nbsp;•&nbsp; Deposit: ₹{formatINR(deposit)}
        </div>
      </div>

      {/* Date Pickers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} /> PICK-UP DATE
          </label>
          <input type="date" value={pickupDate} min={todayStr} onChange={e => { setPickupDate(e.target.value); setAvailability(null); setBreakdown(null); }}
            style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} /> PICK-UP TIME
          </label>
          <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} style={inputStyle}>
            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} /> RETURN DATE
          </label>
          <input type="date" value={returnDate} min={pickupDate || todayStr} onChange={e => { setReturnDate(e.target.value); setAvailability(null); setBreakdown(null); }}
            style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
            <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} /> RETURN TIME
          </label>
          <select value={returnTime} onChange={e => setReturnTime(e.target.value)} style={inputStyle}>
            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Date Error */}
      {dateError && (
        <div style={{ backgroundColor: 'rgba(255,46,84,0.1)', border: '1px solid rgba(255,46,84,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#FF2E54', fontSize: '0.82rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertTriangle size={14} /> {dateError}
        </div>
      )}

      {/* Check Availability Button */}
      <button
        onClick={handleCheckAvailability}
        disabled={!pickupDate || !returnDate || checking}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: (!pickupDate || !returnDate) ? '#2D333F' : '#E08E45',
          color: (!pickupDate || !returnDate) ? '#555' : '#0F1115',
          fontWeight: '700',
          fontSize: '0.95rem',
          cursor: (!pickupDate || !returnDate) ? 'not-allowed' : 'pointer',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px',
          transition: 'background 0.2s'
        }}
      >
        {checking ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Checking...</> : '🔍 Check Availability & Calculate'}
      </button>

      {/* Availability Status */}
      {availability && (
        <div style={{
          backgroundColor: availability.available ? 'rgba(0,255,136,0.08)' : 'rgba(255,46,84,0.08)',
          border: `1px solid ${availability.available ? 'rgba(0,255,136,0.3)' : 'rgba(255,46,84,0.3)'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: availability.available ? '#00FF88' : '#FF2E54',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          {availability.available ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {availability.message}
        </div>
      )}

      {/* Price Breakdown */}
      {breakdown && (
        <div style={{ backgroundColor: '#20242B', border: '1px solid #2D333F', borderRadius: '12px', padding: '18px', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '12px' }}>📋 Rental Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Row label="Duration" val={`${breakdown.totalDays} Day${breakdown.totalDays !== 1 ? 's' : ''}`} />
            {breakdown.weekdays > 0 && <Row label={`Weekday Charges (${breakdown.weekdays}d × ₹${formatINR(weekdayRate)})`} val={`₹${formatINR(breakdown.weekdayCharge)}`} />}
            {breakdown.weekends > 0 && <Row label={`Weekend Charges (${breakdown.weekends}d × ₹${formatINR(weekendRate)})`} val={`₹${formatINR(breakdown.weekendCharge)}`} />}
            <div style={{ height: '1px', backgroundColor: '#2D333F', margin: '4px 0' }} />
            <Row label="Rental Cost" val={`₹${formatINR(breakdown.totalRental)}`} bold />
            <Row label="Refundable Deposit" val={`₹${formatINR(deposit)}`} color="#94A3B8" />
            <div style={{ height: '1px', backgroundColor: '#2D333F', margin: '4px 0' }} />
            <Row label="Total Payable" val={`₹${formatINR(totalPayable)}`} bold accent />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '10px' }}>
            * Security deposit refunded after vehicle inspection.
          </div>
        </div>
      )}

      {/* Terms Checkbox */}
      {breakdown && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
            style={{ marginTop: '3px', accentColor: '#E08E45', width: '16px', height: '16px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
            I agree to the rental terms & conditions and accept responsibility for the vehicle during the rental period.
          </span>
        </label>
      )}

      {/* Not logged in warning */}
      {!user && breakdown && (
        <div style={{ backgroundColor: 'rgba(224,142,69,0.08)', border: '1px solid rgba(224,142,69,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', color: '#E08E45', fontSize: '0.82rem' }}>
          ⚠️ Please log in to confirm your reservation.
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '10px',
          border: 'none',
          background: canConfirm ? 'linear-gradient(135deg, #E08E45, #C07030)' : '#2D333F',
          color: canConfirm ? '#0F1115' : '#555',
          fontWeight: '800',
          fontSize: '1rem',
          cursor: canConfirm ? 'pointer' : 'not-allowed',
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '0.3px',
          transition: 'all 0.2s',
          boxShadow: canConfirm ? '0 4px 20px rgba(224,142,69,0.3)' : 'none'
        }}
      >
        🔒 Confirm & Lock Reservation
      </button>
    </div>
  );
};

const Row = ({ label, val, bold, color, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '0.82rem', color: color || '#94A3B8' }}>{label}</span>
    <span style={{ fontSize: bold ? '0.95rem' : '0.85rem', fontWeight: bold ? '700' : '500', color: accent ? '#E08E45' : (color || '#FFFFFF') }}>
      {val}
    </span>
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  backgroundColor: '#20242B',
  border: '1px solid #2D333F',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '0.85rem',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  colorScheme: 'dark'
};

const timeOptions = [
  '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'
];
