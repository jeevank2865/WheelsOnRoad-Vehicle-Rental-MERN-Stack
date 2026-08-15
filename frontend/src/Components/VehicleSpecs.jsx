import React from 'react';
import { 
  Gauge, 
  Zap, 
  Fuel, 
  Cog, 
  Users, 
  Activity, 
  ShieldCheck, 
  Disc, 
  Maximize2, 
  Radio, 
  Wind,
  Navigation,
  Compass,
  Cpu
} from 'lucide-react';

export const VehicleSpecs = ({ vehicle }) => {
  if (!vehicle) return null;
  const isBike = vehicle.vehicleType === 'Superbike';

  // Dynamic specs mapping
  const specList = [];

  if (isBike) {
    if (vehicle.engineCC) specList.push({ label: 'Engine Capacity', val: `${vehicle.engineCC} cc`, icon: <Gauge size={16} color="#E08E45" /> });
    if (vehicle.powerHP) specList.push({ label: 'Maximum Power', val: `${vehicle.powerHP} HP`, icon: <Zap size={16} color="#E08E45" /> });
    if (vehicle.transmission) specList.push({ label: 'Transmission', val: vehicle.transmission, icon: <Cog size={16} color="#E08E45" /> });
    if (vehicle.fuelType) specList.push({ label: 'Fuel Type', val: vehicle.fuelType, icon: <Fuel size={16} color="#E08E45" /> });
    specList.push({ label: 'ABS System', val: 'Dual-Channel ABS', icon: <ShieldCheck size={16} color="#E08E45" /> });
    specList.push({ label: 'Tyre Type', val: 'Tubeless Radial', icon: <Disc size={16} color="#E08E45" /> });
    specList.push({ label: 'Connectivity', val: 'Digital / Bluetooth', icon: <Radio size={16} color="#E08E45" /> });
  } else {
    if (vehicle.engineCC) specList.push({ label: 'Engine', val: `${vehicle.engineCC} cc`, icon: <Gauge size={16} color="#E08E45" /> });
    if (vehicle.powerHP) specList.push({ label: 'Power', val: `${vehicle.powerHP} HP`, icon: <Zap size={16} color="#E08E45" /> });
    if (vehicle.transmission) specList.push({ label: 'Transmission', val: vehicle.transmission, icon: <Cog size={16} color="#E08E45" /> });
    if (vehicle.fuelType) specList.push({ label: 'Fuel Type', val: vehicle.fuelType, icon: <Fuel size={16} color="#E08E45" /> });
    if (vehicle.seatingCapacity) specList.push({ label: 'Seating Capacity', val: `${vehicle.seatingCapacity} Persons`, icon: <Users size={16} color="#E08E45" /> });
    specList.push({ label: 'Airbags & ESC', val: 'Standard Equipped', icon: <ShieldCheck size={16} color="#E08E45" /> });
    specList.push({ label: 'Infotainment', val: 'Touchscreen / Android Auto', icon: <Cpu size={16} color="#E08E45" /> });
  }

  // Include any extra dynamic map specifications from backend
  if (vehicle.specifications) {
    const specEntries = vehicle.specifications instanceof Map ? Array.from(vehicle.specifications.entries()) : Object.entries(vehicle.specifications);
    specEntries.forEach(([key, val]) => {
      if (val) specList.push({ label: key, val, icon: <Compass size={16} color="#E08E45" /> });
    });
  }

  if (specList.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '18px' }}>
        ⚙️ Technical Specifications
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {specList.map((item, idx) => (
          <div key={idx} style={{ backgroundColor: '#20242B', border: '1px solid #2D333F', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(224,142,69,0.1)', padding: '8px', borderRadius: '8px' }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: '700', marginTop: '2px' }}>{item.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
