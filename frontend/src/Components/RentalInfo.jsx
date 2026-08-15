import React from 'react';
import { Check } from 'lucide-react';

const DEFAULT_INCLUDED = [
  'Vehicle rental for the agreed period',
  'Valid vehicle documents (RC, Insurance)',
  'Basic roadside assistance',
  'Helmet & safety equipment (for bikes)',
  'Fuel at time of pickup',
  'Customer support during rental'
];

const REQUIREMENTS = [
  'Valid driving licence (applicable category)',
  'Government-issued photo ID (Aadhaar / Passport)',
  'Minimum age as per rental policy',
  'Refundable security deposit',
  'Acceptance of rental terms & conditions',
  'Compliance with applicable traffic laws'
];

const IMPORTANT_INFO = [
  'Inspect the vehicle before starting your rental.',
  'Record existing scratches or damage during vehicle pickup.',
  'Customer is responsible for all traffic fines during the rental period.',
  'Vehicle must be returned at the agreed date and time.',
  'Late return charges will apply as per the rental policy.',
  'Fuel policy: return the vehicle with the same fuel level.',
  'Security deposit refund is subject to vehicle inspection after return.'
];

export const RentalInfo = ({ includedItems }) => {
  const items = includedItems && includedItems.length > 0 ? includedItems : DEFAULT_INCLUDED;

  return (
    <>
      {/* What's Included */}
      <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
          📦 What's Included
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={11} color="#00FF88" />
              </div>
              <span style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rental Requirements */}
      <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
          📋 Rental Requirements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {REQUIREMENTS.map((req, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(224,142,69,0.12)', border: '1px solid rgba(224,142,69,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={11} color="#E08E45" />
              </div>
              <span style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div style={{ backgroundColor: 'rgba(224,142,69,0.04)', border: '1px solid rgba(224,142,69,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ color: '#E08E45', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
          ⚠️ Important Information
        </h3>
        <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {IMPORTANT_INFO.map((info, idx) => (
            <li key={idx} style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>{info}</li>
          ))}
        </ul>
      </div>
    </>
  );
};
