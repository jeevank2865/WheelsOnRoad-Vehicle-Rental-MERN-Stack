import React, { useContext, useState } from 'react';
import { ApexContext } from '../Context/ApexContext';
import { Gauge, X, Lock, ShieldAlert } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useContext(ApexContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSignUp) await register(name, email, password, role);
      else await login(email, password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#181B20', border: '1px solid #2D333F', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '36px', position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(255,122,0,0.15), rgba(255,122,0,0.3))', border: '1px solid rgba(255,122,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} color="#FF7A00" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>{isSignUp ? 'Create ApexLease Account' : 'Secure Login'}</h2>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{isSignUp ? 'Access premium fleet reservations' : 'Sign in to manage your bookings'}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,46,84,0.1)', border: '1px solid rgba(255,46,84,0.4)', color: '#FF6B6B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94A3B8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Rider" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', outline: 'none' }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94A3B8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="rider@apexlease.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94A3B8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94A3B8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Type</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #2D333F', backgroundColor: '#20242B', color: '#FFF', fontSize: '0.9rem', cursor: 'pointer' }}>
                <option value="customer">Renter / Driver</option>
              </select>
            </div>
          )}
          <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5722)', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '6px', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.3px', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In to ApexLease')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
          {isSignUp ? 'Already have an account?' : "New to ApexLease?"}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} style={{ background: 'none', border: 'none', color: '#FF7A00', fontWeight: '700', cursor: 'pointer' }}>
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
