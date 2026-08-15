import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ArrowLeft, Star, MapPin, Calendar, Shield, ChevronRight } from 'lucide-react';
import { ApexContext } from '../Context/ApexContext';

import { VehicleGallery } from '../Components/VehicleGallery';
import { VehicleSpecs } from '../Components/VehicleSpecs';
import { VehicleFeatures } from '../Components/VehicleFeatures';
import { RentalBookingCard } from '../Components/RentalBookingCard';
import { VehicleReviews } from '../Components/VehicleReviews';
import { SimilarVehicles } from '../Components/SimilarVehicles';
import { ExternalLinks } from '../Components/ExternalLinks';
import { RentalInfo } from '../Components/RentalInfo';
import { BookingConfirmationModal } from '../Components/BookingConfirmationModal';

const API_URL = 'http://localhost:5000/api';
const formatINR = (n) => Number(n).toLocaleString('en-IN');

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ h = '20px', w = '100%', r = '8px' }) => (
  <div style={{ height: h, width: w, backgroundColor: '#20242B', borderRadius: r, animation: 'pulse 1.5s infinite' }} />
);

export const VehicleDetails = ({ vehicleId, onBack, onViewSimilar }) => {
  const { user } = useContext(ApexContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const fetchVehicle = async () => {
    if (!vehicleId) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/vehicles/${vehicleId}`);
      setVehicle(res.data);
    } catch {
      setError('Failed to load vehicle details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [vehicleId]);

  const handleConfirmOpen = (bookingData) => {
    setPendingBooking(bookingData);
    setShowConfirmModal(true);
  };

  const handleConfirmed = () => {
    setShowConfirmModal(false);
    setPendingBooking(null);
  };

  const isBike = vehicle?.vehicleType === 'Superbike';
  const accentColor = isBike ? '#00F0FF' : '#FF2E54';
  const avgRating = vehicle?.averageRating || 4.8;
  const reviewCount = vehicle?.reviewCount || (vehicle?.reviews?.length || 0);

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <div style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{error}</div>
        <button onClick={onBack} style={backBtnStyle}>← Back to Fleet</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0F1115', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#181B20', borderBottom: '1px solid #2D333F', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ ...backBtnStyle, padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={15} /> Back to Fleet
        </button>
        {vehicle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.82rem' }}>
            <span>Fleet</span>
            <ChevronRight size={13} />
            <span>{vehicle.brand}</span>
            <ChevronRight size={13} />
            <span style={{ color: '#CBD5E1' }}>{vehicle.title}</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '36px 24px 60px' }}>

        {loading ? (
          /* ── Loading Skeleton ──────────────────────────────────────────────── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
            <div>
              <Skeleton h="440px" r="16px" />
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                {[1,2,3].map(i => <Skeleton key={i} h="65px" w="100px" r="10px" />)}
              </div>
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Skeleton h="18px" w="60%" />
                <Skeleton h="32px" w="80%" />
                <Skeleton h="14px" w="40%" />
              </div>
            </div>
            <div>
              <Skeleton h="480px" r="20px" />
            </div>
          </div>
        ) : vehicle ? (
          /* ── Main Content ──────────────────────────────────────────────────── */
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '40px', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div>
              {/* Vehicle Gallery */}
              <VehicleGallery images={vehicle.images} title={vehicle.title} />

              {/* Vehicle Header Card */}
              <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                {/* Badges Row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{ backgroundColor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}44`, borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                    {isBike ? '🏍 SUPERBIKE' : '🚗 CAR'}
                  </span>
                  <span style={{ backgroundColor: 'rgba(100,116,139,0.15)', color: '#94A3B8', border: '1px solid #2D333F', borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '600' }}>
                    {vehicle.category}
                  </span>
                  {vehicle.year && (
                    <span style={{ backgroundColor: 'rgba(224,142,69,0.1)', color: '#E08E45', border: '1px solid rgba(224,142,69,0.2)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '600' }}>
                      📅 {vehicle.year}
                    </span>
                  )}
                  <span style={{ backgroundColor: vehicle.isAvailable ? 'rgba(0,255,136,0.1)' : 'rgba(255,46,84,0.1)', color: vehicle.isAvailable ? '#00FF88' : '#FF2E54', border: `1px solid ${vehicle.isAvailable ? 'rgba(0,255,136,0.3)' : 'rgba(255,46,84,0.3)'}`, borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {vehicle.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                  </span>
                </div>

                {/* Brand & Title */}
                <div style={{ fontSize: '0.85rem', color: '#E08E45', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  {vehicle.brand}
                </div>
                <h1 style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', margin: '0 0 8px', lineHeight: '1.2' }}>
                  {vehicle.title}
                </h1>

                {/* Sub-info Row */}
                <div style={{ color: '#94A3B8', fontSize: '0.88rem', display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '14px', alignItems: 'center' }}>
                  {vehicle.engineCC && <span>🔧 {vehicle.engineCC}cc</span>}
                  {vehicle.fuelType && <span>⛽ {vehicle.fuelType}</span>}
                  {vehicle.transmission && <span>⚙️ {vehicle.transmission}</span>}
                  {vehicle.seatingCapacity && vehicle.vehicleType === 'Car' && <span>👥 {vehicle.seatingCapacity} Seats</span>}
                </div>

                {/* Rating Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={15} fill={i <= Math.round(avgRating) ? '#E08E45' : 'transparent'} color={i <= Math.round(avgRating) ? '#E08E45' : '#64748B'} />
                      ))}
                    </div>
                    <span style={{ color: '#E08E45', fontWeight: '700', fontSize: '0.92rem' }}>{Number(avgRating).toFixed(1)}</span>
                  </div>
                  <span style={{ color: '#64748B', fontSize: '0.82rem' }}>({reviewCount} Reviews)</span>
                  <span style={{ color: '#64748B', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {vehicle.locationBranch || 'Central Hub'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.15rem', fontWeight: '700', marginBottom: '14px' }}>About This Vehicle</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.93rem', lineHeight: '1.75', margin: 0 }}>{vehicle.description}</p>
                </div>
              )}

              {/* Specifications */}
              <VehicleSpecs vehicle={vehicle} />

              {/* Features */}
              <VehicleFeatures features={vehicle.features} vehicleType={vehicle.vehicleType} />

              {/* External Links */}
              <ExternalLinks links={vehicle.externalLinks} />

              {/* Rental Info (Included, Requirements, Important) */}
              <RentalInfo includedItems={vehicle.includedItems} />

              {/* Reviews */}
              <VehicleReviews vehicle={vehicle} user={user} onReviewAdded={fetchVehicle} />

              {/* Similar Vehicles */}
              <SimilarVehicles
                vehicleId={vehicle._id}
                vehicleType={vehicle.vehicleType}
                onViewDetails={(v) => { if (onViewSimilar) onViewSimilar(v._id); }}
              />
            </div>

            {/* ── RIGHT COLUMN (Sticky Booking Card) ─────────────────────── */}
            <div>
              {/* Pricing Summary (top of sidebar) */}
              <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <PriceBox label="Weekday Rate" val={`₹${formatINR(vehicle.weekdayRate || vehicle.dailyRate)}`} sub="/day" />
                  <PriceBox label="Weekend Rate" val={`₹${formatINR(vehicle.weekendRate || vehicle.weekendSurgeRate || vehicle.dailyRate)}`} sub="/day" dim />
                </div>
                <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#20242B', borderRadius: '10px', border: '1px solid #2D333F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={13} /> Refundable Deposit
                  </span>
                  <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.88rem' }}>₹{formatINR(vehicle.securityDeposit)}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '8px', textAlign: 'center' }}>
                  Deposit returned after vehicle inspection per rental policy.
                </div>
              </div>

              {/* Rental Booking Card (Date pickers + check + confirm) */}
              <RentalBookingCard
                vehicle={vehicle}
                user={user}
                onConfirm={handleConfirmOpen}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmModal && vehicle && pendingBooking && (
        <BookingConfirmationModal
          vehicle={vehicle}
          bookingData={pendingBooking}
          onClose={() => { setShowConfirmModal(false); setPendingBooking(null); }}
          onConfirmed={handleConfirmed}
        />
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

        @media (max-width: 900px) {
          .vehicle-details-grid { grid-template-columns: 1fr !important; }
          .vehicle-details-sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
};

const PriceBox = ({ label, val, sub, dim }) => (
  <div>
    <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: dim ? '#94A3B8' : '#E08E45', fontFamily: 'Outfit, sans-serif' }}>
      {val}<span style={{ fontSize: '0.78rem', fontWeight: '400', color: '#64748B' }}>{sub}</span>
    </div>
  </div>
);

const backBtnStyle = {
  backgroundColor: '#20242B',
  border: '1px solid #2D333F',
  color: '#CBD5E1',
  padding: '10px 18px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: '600',
  fontFamily: 'Outfit, sans-serif',
  transition: 'all 0.2s',
};
