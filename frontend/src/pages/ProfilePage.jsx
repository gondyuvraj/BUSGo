import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Phone, Mail, Save, Loader2, Ticket, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ flex: 1, background: '#F8FAFC', paddingBottom: '5rem' }}>
      <div style={{
        background: '#0B132B',
        color: '#fff',
        padding: '2.5rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Passenger Account Profile
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.9rem' }}>
            Manage your personal traveler details and saved contact preferences
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem', maxWidth: '800px' }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #E2E8F0',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          {/* Avatar Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '2rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg, #EF4444, #F59E0B)' : 'linear-gradient(135deg, #2563EB, #06B6D4)',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(37,99,235,0.25)',
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {user?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className="badge" style={{
                  background: isAdmin ? '#FEE2E2' : '#EFF6FF',
                  color: isAdmin ? '#991B1B' : '#1D4ED8',
                }}>
                  {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED PASSENGER'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Registered Email (Permanent)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                    border: '1.5px solid #E2E8F0',
                    background: '#F1F5F9',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    color: '#64748B',
                    boxSizing: 'border-box',
                    cursor: 'not-allowed',
                  }}
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '1.5rem',
              marginTop: '0.5rem',
            }}>
              <Link to="/my-bookings" style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={18} /> View My Bookings
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ padding: '0.8rem 1.75rem' }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          {/* Admin Quick Access */}
          {isAdmin && (
            <div style={{
              marginTop: '2rem',
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#EF4444', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff',
                }}>
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Admin Control Panel</div>
                  <div style={{ color: '#A5B4FC', fontSize: '0.82rem' }}>Manage buses, routes, schedules & users</div>
                </div>
              </div>
              <Link
                to="/admin"
                style={{
                  background: '#EF4444', color: '#fff', padding: '0.65rem 1.5rem',
                  borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <ShieldAlert size={16} /> Open Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
