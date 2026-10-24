import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, User, LogOut, ShieldAlert, Ticket, Menu, X, ChevronDown, Palmtree } from 'lucide-react';
import AppDrawer from './AppDrawer';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">

          {/* ── Brand Logo — click opens App Drawer ── */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="brand-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            title="Open BusGo Menu"
          >
            <div className="brand-icon-wrapper" style={{ transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Bus size={24} />
            </div>
            <span>Bus<span className="accent">Go</span></span>
          </button>

          {/* ── Desktop Navigation Links ── */}
          <ul className="nav-links desktop-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            </li>
            <li>
              <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>Search Buses</Link>
            </li>
            <li>
              <Link to="/holiday-trips" className={`nav-link ${isActive('/holiday-trips') ? 'active' : ''}`}>
                <Palmtree size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Holiday Trips
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}>My Bookings</Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </li>
            <li>
              <Link to="/ai-assistant" className={`nav-link ${isActive('/ai-assistant') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.75rem' }}>🤖</span> AI
              </Link>
            </li>
          </ul>

          {/* ── Auth Group ── */}
          <div className="nav-auth-group">
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.45rem 0.95rem', borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #EF4444, #F59E0B)'
                      : 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem',
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    {isAdmin && (
                      <span style={{ fontSize: '0.65rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase' }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                  <ChevronDown size={14} color="#94A3B8" />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '115%',
                    background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '14px', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.5)',
                    width: '210px', padding: '0.5rem', zIndex: 200,
                    animation: 'fadeIn 0.15s ease-out',
                  }}>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 0.85rem', color: '#FCA5A5', fontWeight: 600, fontSize: '0.88rem', borderRadius: '8px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <ShieldAlert size={16} /> Admin Portal
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 0.85rem', color: '#E2E8F0', fontWeight: 500, fontSize: '0.88rem', borderRadius: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 0.85rem', color: '#E2E8F0', fontWeight: 500, fontSize: '0.88rem', borderRadius: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Ticket size={16} /> My Bookings
                    </Link>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.35rem 0' }} />
                    <button onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 0.85rem', color: '#F87171', fontWeight: 600, fontSize: '0.88rem', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Link to="/login" className="btn-outline" style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle-btn"
              style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px' }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div style={{ background: '#0B132B', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>Home</Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>Search Buses</Link>
            <Link to="/holiday-trips" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>🌴 Holiday Trips</Link>
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>My Bookings</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontWeight: 600, padding: '0.5rem 0' }}>Contact</Link>
            <Link to="/ai-assistant" onClick={() => setMobileMenuOpen(false)} style={{ color: '#93C5FD', fontWeight: 700, padding: '0.5rem 0' }}>🤖 AI Assistant</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F87171', fontWeight: 700, padding: '0.5rem 0' }}>
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* ── App Drawer ── */}
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
