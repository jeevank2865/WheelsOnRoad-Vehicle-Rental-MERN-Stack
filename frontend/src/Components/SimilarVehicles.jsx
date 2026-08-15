import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const BIKE_FALLBACK = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop';
const CAR_FALLBACK  = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop';

const formatINR = (n) => Number(n).toLocaleString('en-IN');

export const SimilarVehicles = ({ vehicleId, vehicleType, onViewDetails }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) return;
    setLoading(true);
    axios.get(`${API_URL}/vehicles/${vehicleId}/similar`)
      .then(res => setSimilar(res.data.slice(0, 4)))
      .catch(() => setSimilar([]))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (!loading && similar.length === 0) return null;

  const isBike = vehicleType === 'Superbike';
  const fallback = isBike ? BIKE_FALLBACK : CAR_FALLBACK;

  return (
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '20px' }}>
        🏍 You May Also Like
      </h3>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '14px', overflow: 'hidden', height: '250px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {similar.map(v => {
            const img = v.images && v.images[0] ? v.images[0] : fallback;
            const accentColor = v.vehicleType === 'Superbike' ? '#00F0FF' : '#FF2E54';
            return (
              <div
                key={v._id}
                onClick={() => onViewDetails && onViewDetails(v)}
                style={{
                  backgroundColor: '#181B20',
                  border: '1px solid #2D333F',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${accentColor}55`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1px solid #2D333F'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
                  <img src={img} alt={v.title} onError={e => { e.target.src = fallback; }} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181B20 0%, transparent 60%)' }} />
                  <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}44`, borderRadius: '5px', padding: '3px 8px', fontSize: '0.68rem', fontWeight: '700' }}>
                    {v.vehicleType === 'Superbike' ? '🏍' : '🚗'} {v.category}
                  </span>
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#E08E45', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>{v.brand}</div>
                  <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', marginBottom: '8px', lineHeight: '1.3' }}>{v.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#E08E45', fontWeight: '800', fontSize: '1rem' }}>
                      ₹{formatINR(v.dailyRate)}<span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '400' }}>/day</span>
                    </span>
                    <span style={{ color: accentColor, fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
