import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import TicketConfirmationModal from '../components/TicketConfirmationModal';
import {
  Ticket, Calendar, Clock, AlertTriangle, Printer,
  ArrowRight, XCircle, Loader2, Navigation, Trash2
} from 'lucide-react';

const CANCELLATION_REASONS = [
  { value: 'CHANGE_OF_PLANS', label: 'My plans have changed' },
  { value: 'DATE_OR_TIME_CHANGED', label: 'My travel date or time has changed' },
  { value: 'BOOKED_BY_MISTAKE', label: 'I made this booking by mistake' },
  { value: 'FOUND_ALTERNATIVE_TRANSPORT', label: 'I found another way to travel' },
  { value: 'TRAVEL_PURPOSE_CHANGED', label: 'My purpose of travel has changed' },
  { value: 'BUS_OR_OPERATOR_CONCERN', label: 'I have a concern about the bus or operator' },
  { value: 'OTHER', label: 'Other reason' },
];

export default function MyBookingsPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'CONFIRMED', 'CANCELLED'
  const [hiddenIds, setHiddenIds] = useState([]); // locally hidden cancelled booking IDs

  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationDetails, setCancellationDetails] = useState('');

  const hideCancelled = (id) => setHiddenIds(prev => [...prev, id]);
  const clearAllCancelled = () => {
    const ids = bookings.filter(b => b.bookingStatus === 'CANCELLED').map(b => b.id);
    setHiddenIds(prev => [...prev, ...ids]);
    if (filterTab === 'CANCELLED') setFilterTab('ALL');
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate, fetchBookings]);

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    if (!cancellationReason) {
      showToast('Select a reason before cancelling your ticket.', 'error');
      return;
    }
    if (cancellationReason === 'OTHER' && !cancellationDetails.trim()) {
      showToast('Please tell us why you are cancelling.', 'error');
      return;
    }

    setCancelling(true);
    try {
      const res = await api.cancelBooking(cancelModalBooking.id, {
        reason: cancellationReason,
        details: cancellationReason === 'OTHER' ? cancellationDetails.trim() : '',
      });
      showToast(`Booking ${res.bookingReference} cancelled. Refund of 90% processed.`, 'success');
      setCancelModalBooking(null);
      setCancellationReason('');
      setCancellationDetails('');
      fetchBookings();
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (hiddenIds.includes(b.id)) return false;
    if (filterTab === 'CONFIRMED') return b.bookingStatus === 'CONFIRMED';
    if (filterTab === 'CANCELLED') return b.bookingStatus === 'CANCELLED';
    return true;
  });

  const visibleCancelledCount = bookings.filter(b => b.bookingStatus === 'CANCELLED' && !hiddenIds.includes(b.id)).length;

  return (
    <div style={{ flex: 1, background: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Page Header */}
      <div style={{
        background: '#0B132B',
        color: '#fff',
        padding: '2.5rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon-wrapper" style={{ width: '44px', height: '44px' }}>
              <Ticket size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                My Travel Bookings
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.9rem' }}>
                View your confirmed e-tickets, boarding passes, and manage cancellations.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {!loading && bookings.length > 0 && (
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Trips', value: bookings.length, color: '#60A5FA' },
                { label: 'Confirmed', value: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length, color: '#34D399' },
                { label: 'Cancelled', value: bookings.filter(b => b.bookingStatus === 'CANCELLED').length, color: '#F87171' },
                {
                  label: 'Total Spent',
                  value: '₹' + bookings.filter(b => b.bookingStatus === 'CONFIRMED').reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString('en-IN'),
                  color: '#FBBF24',
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, marginTop: '2px' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Tabs Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', gap: '6px', background: '#E2E8F0',
            padding: '4px', borderRadius: '12px',
          }}>
            {[
              { id: 'ALL',       label: `All (${bookings.filter(b => !hiddenIds.includes(b.id)).length})` },
              { id: 'CONFIRMED', label: `Confirmed (${bookings.filter(b => b.bookingStatus === 'CONFIRMED' && !hiddenIds.includes(b.id)).length})` },
              { id: 'CANCELLED', label: `Cancelled (${visibleCancelledCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                style={{
                  padding: '8px 18px', borderRadius: '10px',
                  fontWeight: 700, fontSize: '0.88rem',
                  background: filterTab === tab.id ? '#fff' : 'transparent',
                  color: filterTab === tab.id ? '#0F172A' : '#64748B',
                  boxShadow: filterTab === tab.id ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer', border: 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clear All Cancelled button — only shows when there are visible cancelled bookings */}
          {visibleCancelledCount > 0 && (
            <button
              onClick={clearAllCancelled}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: '#FEF2F2', border: '1.5px solid #FECACA',
                color: '#DC2626', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
            >
              <Trash2 size={15} />
              Clear All Cancelled ({visibleCancelledCount})
            </button>
          )}
        </div>

        {/* Bookings Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={36} className="animate-spin" color="#2563EB" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748B', fontWeight: 600 }}>Retrieving your booking history...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <Ticket size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              No Bookings in this Category
            </h3>
            <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
              You don't have any bookings matching this tab. Start your next luxury journey with BusGo today!
            </p>
            <button onClick={() => navigate('/search')} className="btn-primary">
              <span>Book a Bus Ticket</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredBookings.map((b) => {
              const isConfirmed = b.bookingStatus === 'CONFIRMED';
              return (
                <div
                  key={b.id}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', borderBottom: '1px solid #F1F5F9',
                    paddingBottom: '1rem', marginBottom: '1rem', gap: '0.75rem',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        Booking Reference
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB' }}>
                        {b.bookingReference}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        className="badge"
                        style={{
                          background: isConfirmed ? '#DCFCE7' : '#FEE2E2',
                          color: isConfirmed ? '#166534' : '#991B1B',
                          fontSize: '0.82rem', padding: '0.35rem 0.75rem',
                        }}
                      >
                        {isConfirmed ? '● CONFIRMED' : '● CANCELLED'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        Paid via {b.paymentStatus}
                      </span>

                      {/* ── Delete button — only on cancelled bookings ── */}
                      {!isConfirmed && (
                        <button
                          type="button"
                          onClick={() => hideCancelled(b.id)}
                          title="Remove from history"
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#FEF2F2', border: '1.5px solid #FECACA',
                            color: '#EF4444', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s', flexShrink: 0,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route & Timing Body */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        {b.sourceCity} → {b.destinationCity}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                        {b.operatorName} • {b.busType?.replace('_', ' ')}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                        <Calendar size={15} color="#2563EB" /> {b.journeyDate}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                        <Clock size={14} /> {b.departureTime} → {b.arrivalTime}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        Allocated Seats
                      </span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EA580C' }}>
                        {b.seatNumbers}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        Total Fare
                      </span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                        ₹{b.totalAmount}
                      </div>
                    </div>
                  </div>

                  {!isConfirmed && b.cancellationReason && (
                    <div style={{
                      marginBottom: '1rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      background: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      color: '#9A3412',
                      fontSize: '0.84rem',
                    }}>
                      <strong>Cancellation reason: </strong>
                      {CANCELLATION_REASONS.find((reason) => reason.value === b.cancellationReason)?.label || b.cancellationReason}
                      {b.cancellationReasonDetails && <div style={{ marginTop: '4px' }}>{b.cancellationReasonDetails}</div>}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '0.85rem',
                  }}>
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancellationReason('');
                          setCancellationDetails('');
                          setCancelModalBooking(b);
                        }}
                        style={{
                          padding: '0.55rem 1rem', color: '#DC2626',
                          background: '#FEF2F2', border: '1px solid #FCA5A5',
                          borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                      >
                        <XCircle size={15} /> Cancel Ticket
                      </button>
                    )}

                    {/* Track Bus button — only for confirmed bookings */}
                    {isConfirmed && (
                      <Link
                        to={`/track/${b.bookingReference}`}
                        style={{
                          padding: '0.55rem 1rem', color: '#fff',
                          background: 'linear-gradient(135deg,#10B981,#059669)',
                          border: 'none', borderRadius: '8px',
                          fontSize: '0.85rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                          textDecoration: 'none', boxShadow: '0 3px 10px rgba(16,185,129,0.35)',
                        }}
                      >
                        <Navigation size={15} /> Track Bus
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', animation: 'liveBlip 1s infinite', display: 'inline-block' }} />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedTicket(b)}
                      className="btn-primary"
                      style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      <Printer size={16} /> View Boarding Pass
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketConfirmationModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}>
                <AlertTriangle size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Cancel Ticket Reservation?
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
                PNR: <strong>{cancelModalBooking.bookingReference}</strong> ({cancelModalBooking.sourceCity} → {cancelModalBooking.destinationCity})
              </p>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Original Fare Paid:</span>
                <strong>₹{cancelModalBooking.totalAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 700 }}>
                <span>Eligible Refund (90%):</span>
                <span>₹{Math.round(cancelModalBooking.totalAmount * 0.9 * 100) / 100}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Standard 10% processing deduction applies per BusGo terms.
              </div>
            </div>

            <label style={{ display: 'block', color: '#334155', fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.8rem' }}>
              Why are you cancelling? <span style={{ color: '#DC2626' }}>*</span>
              <select
                value={cancellationReason}
                onChange={(event) => {
                  setCancellationReason(event.target.value);
                  if (event.target.value !== 'OTHER') setCancellationDetails('');
                }}
                required
                disabled={cancelling}
                style={{
                  display: 'block', width: '100%', marginTop: '6px', padding: '0.75rem',
                  border: '1px solid #CBD5E1', borderRadius: '9px', background: '#fff',
                  color: '#0F172A', fontSize: '0.9rem',
                }}
              >
                <option value="" disabled>Select a cancellation reason</option>
                {CANCELLATION_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>{reason.label}</option>
                ))}
              </select>
            </label>

            {cancellationReason === 'OTHER' && (
              <label style={{ display: 'block', color: '#334155', fontSize: '0.84rem', fontWeight: 700, marginBottom: '1rem' }}>
                Please share your reason <span style={{ color: '#DC2626' }}>*</span>
                <textarea
                  value={cancellationDetails}
                  onChange={(event) => setCancellationDetails(event.target.value)}
                  maxLength={500}
                  rows={3}
                  required
                  disabled={cancelling}
                  placeholder="Tell us briefly why you need to cancel"
                  style={{
                    display: 'block', width: '100%', marginTop: '6px', padding: '0.75rem',
                    border: '1px solid #CBD5E1', borderRadius: '9px', resize: 'vertical',
                    fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box',
                  }}
                />
                <span style={{ display: 'block', textAlign: 'right', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 500 }}>
                  {cancellationDetails.length}/500
                </span>
              </label>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={cancelling}
                className="btn-outline"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling || !cancellationReason || (cancellationReason === 'OTHER' && !cancellationDetails.trim())}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#DC2626',
                  color: '#fff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {cancelling ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
