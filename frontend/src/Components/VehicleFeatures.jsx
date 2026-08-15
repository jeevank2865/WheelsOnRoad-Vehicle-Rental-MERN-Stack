import React from 'react';
import { Check } from 'lucide-react';

export const VehicleFeatures = ({ features = [], vehicleType = 'Superbike' }) => {
  const isBike = vehicleType === 'Superbike';

  const defaultBikeFeatures = [
    'Dual Channel ABS',
    'LED Headlight & DRLs',
    'Tubeless Radial Tyres',
    'Digital Color Display',
    'Traction Control System',
    'Bluetooth Navigation Sync'
  ];

  const defaultCarFeatures = [
    'Climate Control Air Conditioning',
    'Electronic Stability Control (ESC)',
    'Dual Front & Side Airbags',
    'Touchscreen Infotainment',
    'Apple CarPlay & Android Auto',
    'Reverse Parking Camera & Sensors'
  ];

  const displayFeatures = features && features.length > 0 ? features : (isBike ? defaultBikeFeatures : defaultCarFeatures);

  return (
    <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '18px' }}>
        ✨ Key Features & Amenities
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {displayFeatures.map((feat, idx) => (
          <div key={idx} style={{ backgroundColor: '#20242B', border: '1px solid #2D333F', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.4)', color: '#00FF88', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={13} />
            </div>
            <span style={{ color: '#E2E8F0', fontSize: '0.88rem', fontWeight: '600' }}>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
