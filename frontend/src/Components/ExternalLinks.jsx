import React from 'react';
import { Globe, FileText, BookOpen, Youtube, ArrowUpRight } from 'lucide-react';

export const ExternalLinks = ({ links = {} }) => {
  const { officialWebsite, specifications, brochure, video } = links || {};
  const hasAny = officialWebsite || specifications || brochure || video;
  if (!hasAny) return null;

  const items = [
    { href: officialWebsite, label: 'Official Website', icon: <Globe size={16} />, color: '#60A5FA' },
    { href: specifications, label: 'Full Specifications', icon: <FileText size={16} />, color: '#34D399' },
    { href: brochure, label: 'Official Brochure', icon: <BookOpen size={16} />, color: '#A78BFA' },
    { href: video, label: 'Watch Video', icon: <Youtube size={16} />, color: '#F87171' },
  ].filter(item => !!item.href);

  return (
    <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
        🔗 Learn More About This Vehicle
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#20242B',
              border: `1px solid ${item.color}33`,
              borderRadius: '10px',
              color: item.color,
              fontWeight: '600',
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${item.color}15`; e.currentTarget.style.borderColor = `${item.color}66`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#20242B'; e.currentTarget.style.borderColor = `${item.color}33`; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {item.icon}
            {item.label}
            <ArrowUpRight size={13} />
          </a>
        ))}
      </div>
    </div>
  );
};
