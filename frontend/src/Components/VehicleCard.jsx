import React, { useContext } from 'react';
import { ApexContext } from '../Context/ApexContext';
import { Gauge, Zap, Lock, Star } from 'lucide-react';

const BIKE_FALLBACK = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop';
const CAR_FALLBACK  = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop';

export const VehicleCard = ({ vehicle, onViewDetails }) => {
  const { lockedVehicles } = useContext(ApexContext);

  const isLocked = !!lockedVehicles[vehicle._id];
  const isBike = vehicle.vehicleType === 'Superbike';
  const accentColor = '#FF7A00';
  const fallback = isBike ? BIKE_FALLBACK : CAR_FALLBACK;
  const vehicleImage = vehicle.images && vehicle.images[0] ? vehicle.images[0] : fallback;
  const avgRating = vehicle.averageRating || 4.8;
  const reviewCount = vehicle.reviewCount || 0;

  const handleClick = () => {
    if (!isLocked && onViewDetails) onViewDetails(vehicle._id);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: '#181B20',
        border: `1px solid ${isLocked ? 'rgba(255,46,84,0.35)' : '#2D333F'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isLocked) { e.currentTarget.style.border = `1px solid ${accentColor}55`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`; }}}
      onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${isLocked ? 'rgba(255,46,84,0.35)' : '#2D333F'}`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#20242B' }}>
        <img
          src={vehicleImage}
          alt={`${vehicle.brand} ${vehicle.title}`}
          onError={(e) => { e.target.src = fallback; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181B20 5%, transparent 50%)' }} />

        {/* Vehicle Type Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span style={{ backgroundColor: 'rgba(255, 122, 0, 0.15)', color: accentColor, border: `1px solid ${accentColor}44`, padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.5px' }}>
            {isBike ? '🏍 SUPERBIKE' : '🏎 CAR'}
          </span>
        </div>

        {/* Real-time Lock Indicator */}
        {isLocked && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span className="badge-surge"><Lock size={11} style={{ marginRight: '4px' }} />LIVE LOCKED</span>
          </div>
        )}

        {/* Weekend Surge Badge */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
          <span className="badge-surge">📈 Wknd ₹{vehicle.weekendSurgeRate}/day</span>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: '#FF7A00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{vehicle.brand}</span>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginTop: '2px', lineHeight: '1.3' }}>{vehicle.title}</h3>
          {vehicle.description ? (
            <p style={{ color: '#CBD5E1', fontSize: '0.82rem', marginTop: '6px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {vehicle.description}
            </p>
          ) : (
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '4px' }}>No description provided.</p>
          )}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '1px' }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11} fill={i <= Math.round(avgRating) ? '#FF7A00' : 'transparent'} color={i <= Math.round(avgRating) ? '#FF7A00' : '#64748B'} />
            ))}
          </div>
          <span style={{ color: '#FF7A00', fontWeight: '700', fontSize: '0.8rem' }}>{Number(avgRating).toFixed(1)}</span>
          {reviewCount > 0 && <span style={{ color: '#64748B', fontSize: '0.75rem' }}>({reviewCount})</span>}
        </div>

        {/* Spec Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {vehicle.engineCC && <span className="badge-cc"><Gauge size={12} />{vehicle.engineCC}cc</span>}
          {vehicle.powerHP && <span className="badge-cc"><Zap size={12} />{vehicle.powerHP}HP</span>}
          {vehicle.transmission && (
            <span style={{ backgroundColor: '#20242B', color: '#94A3B8', border: '1px solid #2D333F', padding: '4px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: '600' }}>
              {vehicle.transmission}
            </span>
          )}
        </div>

        {/* Location */}
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '14px' }}>
          📍 {vehicle.locationBranch}
        </div>

        {/* Price Row + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2D333F', paddingTop: '14px' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FF7A00', fontFamily: 'Outfit, sans-serif' }}>
              ₹{vehicle.dailyRate}
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '400' }}>/day</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Deposit: ₹{vehicle.securityDeposit}</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); handleClick(); }}
            style={{ backgroundColor: isLocked ? '#2D333F' : '#FF7A00', color: isLocked ? '#555' : '#0F1115', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: isLocked ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}
          >
            {isLocked ? 'Unavailable' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};
