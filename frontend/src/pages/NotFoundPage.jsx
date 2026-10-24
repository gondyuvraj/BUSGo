import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      flex: 1,
      minHeight: 'calc(100vh - 76px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#EFF6FF',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}>
          <Bus size={36} />
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#0F172A', margin: 0, lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
          Destination Not Found
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          The stop or page you are looking for has departed or does not exist. Let's get you back on the main route.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
          <Home size={18} />
          <span>Return to BusGo Home</span>
        </Link>
      </div>
    </div>
  );
}
