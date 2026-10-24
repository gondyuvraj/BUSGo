import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — wraps routes that require authentication or a specific role.
 *
 * Props:
 *   adminOnly  — if true, only ROLE_ADMIN can access; others get redirected to /
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem',
        color: '#64748B',
      }}>
        <Loader2 size={36} className="animate-spin" color="#2563EB" />
        <span style={{ fontWeight: 600 }}>Verifying session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Authenticated but not admin — send home with a message
    return <Navigate to="/" replace />;
  }

  return children;
}
