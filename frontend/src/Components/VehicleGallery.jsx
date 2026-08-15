import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export const VehicleGallery = ({ images = [], title = '' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop';
  const galleryImages = images && images.length > 0 ? images : [fallback];

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Large Main Image Box */}
      <div
        style={{
          position: 'relative',
          height: '440px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#181B20',
          border: '1px solid #2D333F',
          marginBottom: '14px',
        }}
      >
        <img
          src={galleryImages[activeIdx]}
          alt={`${title} view ${activeIdx + 1}`}
          onError={(e) => { e.target.src = fallback; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
        />

        {/* Previous / Next Arrow Controls */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15,17,21,0.75)',
                border: '1px solid rgba(224,142,69,0.3)',
                color: '#FFF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15,17,21,0.75)',
                border: '1px solid rgba(224,142,69,0.3)',
                color: '#FFF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setIsFullscreen(true)}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: 'rgba(15,17,21,0.8)',
            border: '1px solid #2D333F',
            color: '#E08E45',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Maximize2 size={14} /> Fullscreen
        </button>
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {galleryImages.map((imgUrl, i) => (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: '100px',
                height: '65px',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeIdx === i ? '2px solid #E08E45' : '1px solid #2D333F',
                opacity: activeIdx === i ? 1 : 0.6,
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              <img src={imgUrl} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer',
            }}
          >
            <X size={32} />
          </button>
          <img
            src={galleryImages[activeIdx]}
            alt={title}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }}
          />
        </div>
      )}
    </div>
  );
};
