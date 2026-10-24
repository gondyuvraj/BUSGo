import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import BusCard from '../components/BusCard';
import PassengerFormModal from '../components/PassengerFormModal';
import CheckoutModal from '../components/CheckoutModal';
import TicketConfirmationModal from '../components/TicketConfirmationModal';
import {
  Calendar, Search, AlertCircle, RefreshCw, SlidersHorizontal
} from 'lucide-react';

const TODAY_STR = new Date().toISOString().split('T')[0];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromCity = searchParams.get('from') || 'Mumbai';
  const toCity = searchParams.get('to') || 'Pune';
  const journeyDate = searchParams.get('date') || TODAY_STR;

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filters & Sorting state
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('PRICE_ASC');

  // Booking Flow States
  const [passengerModalData, setPassengerModalData] = useState(null);
  const [checkoutModalData, setCheckoutModalData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchBuses = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.searchBuses(fromCity, toCity, journeyDate);
      setBuses(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to search buses. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, [fromCity, toCity, journeyDate]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // Filter logic
  let filtered = buses.filter((b) => {
    if (busTypeFilter !== 'ALL' && b.busType !== busTypeFilter) return false;

    if (timeFilter !== 'ALL') {
      const timeStr = b.departureTime || '';
      const hour = parseInt(timeStr.split(':')[0], 10) || 0;
      const isPM = timeStr.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

      if (timeFilter === 'MORNING' && (hour24 < 6 || hour24 >= 12)) return false;
      if (timeFilter === 'AFTERNOON' && (hour24 < 12 || hour24 >= 18)) return false;
      if (timeFilter === 'NIGHT' && (hour24 < 18 && hour24 >= 6)) return false;
    }
    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.fare - b.fare;
    if (sortBy === 'PRICE_DESC') return b.fare - a.fare;
    if (sortBy === 'RATING_DESC') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'DURATION_ASC') return (a.durationHours || 0) - (b.durationHours || 0);
    return 0;
  });

  return (
    <div style={{ flex: 1, background: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Route & Search Header Bar */}
      <div style={{
        background: '#0B132B',
        color: '#fff',
        padding: '2rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.75rem', fontWeight: 800 }}>
                <span>{fromCity}</span>
                <span style={{ color: '#FF6B35' }}>→</span>
                <span>{toCity}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.4rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={15} color="#3B82F6" /> {journeyDate}
                </span>
                <span>•</span>
                <span>{filtered.length} {filtered.length === 1 ? 'Bus' : 'Buses'} Available</span>
              </div>
            </div>

            {/* Quick Route Modification Button */}
            <button
              onClick={() => navigate('/')}
              className="btn-outline"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '0.65rem 1.25rem',
                fontSize: '0.88rem',
              }}
            >
              <Search size={16} /> Modify Search
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Left: Filters Sidebar */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '95px',
          }} className="filters-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                <SlidersHorizontal size={18} color="#2563EB" /> Filters
              </div>
              <button
                type="button"
                onClick={() => {
                  setBusTypeFilter('ALL');
                  setTimeFilter('ALL');
                }}
                style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600 }}
              >
                Reset All
              </button>
            </div>

            {/* Bus Type Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Bus Category
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                {[
                  { id: 'ALL', label: 'All Bus Types' },
                  { id: 'AC_SLEEPER', label: 'AC Sleeper' },
                  { id: 'AC_SEATER', label: 'AC Seater' },
                  { id: 'NON_AC_SLEEPER', label: 'Non-AC Sleeper' },
                  { id: 'NON_AC_SEATER', label: 'Non-AC Seater' },
                ].map((t) => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155' }}>
                    <input
                      type="radio"
                      name="busType"
                      checked={busTypeFilter === t.id}
                      onChange={() => setBusTypeFilter(t.id)}
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time Slots */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Departure Timing
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                {[
                  { id: 'ALL', label: 'Any Departure Time' },
                  { id: 'MORNING', label: 'Morning (06:00 AM - 12:00 PM)' },
                  { id: 'AFTERNOON', label: 'Afternoon (12:00 PM - 06:00 PM)' },
                  { id: 'NIGHT', label: 'Night (06:00 PM - 06:00 AM)' },
                ].map((time) => (
                  <label key={time.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155' }}>
                    <input
                      type="radio"
                      name="timeSlot"
                      checked={timeFilter === time.id}
                      onChange={() => setTimeFilter(time.id)}
                    />
                    <span>{time.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.8rem',
              color: '#166534',
            }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>🛡️ BusGo Guarantee:</strong>
              100% money back guarantee if coach departs over 60 mins late without prior alert.
            </div>
          </div>

          {/* Right: Buses List & Sort Bar */}
          <div>
            {/* Sort Bar */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                Showing <strong style={{ color: '#0F172A' }}>{filtered.length}</strong> verified coaches
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                  }}
                >
                  <option value="PRICE_ASC">Price: Lowest First</option>
                  <option value="PRICE_DESC">Price: Highest First</option>
                  <option value="RATING_DESC">Top Rated (★)</option>
                  <option value="DURATION_ASC">Fastest Duration</option>
                </select>
              </div>
            </div>

            {/* Results Rendering */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      background: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94A3B8',
                      fontSize: '0.9rem',
                    }}
                  >
                    <RefreshCw size={24} className="animate-spin" style={{ marginRight: '8px' }} />
                    Loading available coaches & seat layouts...
                  </div>
                ))}
              </div>
            ) : errorMsg ? (
              <div style={{
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#B91C1C',
              }}>
                <AlertCircle size={44} style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Search Failed</h3>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>{errorMsg}</p>
                <button onClick={fetchBuses} className="btn-primary">
                  Try Again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                background: '#ffffff',
                border: '1.5px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '4rem 2rem',
                textAlign: 'center',
              }}>
                <Search size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  No Buses Found for {fromCity} to {toCity}
                </h3>
                <p style={{ color: '#64748B', maxWidth: '460px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
                  We currently operate high-frequency luxury coaches between major cities like Mumbai, Pune, Bangalore, Hyderabad, Delhi, and Goa.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => navigate('/search?from=Mumbai&to=Pune')}
                    className="btn-primary"
                  >
                    View Mumbai → Pune Buses
                  </button>
                  <button
                    onClick={() => navigate('/search?from=Bangalore&to=Hyderabad')}
                    className="btn-outline"
                  >
                    Bangalore → Hyderabad
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {filtered.map((bus) => (
                  <BusCard
                    key={bus.scheduleId}
                    bus={bus}
                    journeyDate={journeyDate}
                    onProceedToBooking={(data) => setPassengerModalData(data)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Flow Modals */}
      {passengerModalData && (
        <PassengerFormModal
          bookingData={passengerModalData}
          onClose={() => setPassengerModalData(null)}
          onProceedToPayment={(fullBooking) => {
            setPassengerModalData(null);
            setCheckoutModalData(fullBooking);
          }}
        />
      )}

      {checkoutModalData && (
        <CheckoutModal
          bookingData={checkoutModalData}
          onClose={() => setCheckoutModalData(null)}
          onSuccess={(confirmed) => {
            setCheckoutModalData(null);
            setConfirmedBooking(confirmed);
            // Refresh buses so booked seats update immediately
            fetchBuses();
          }}
        />
      )}

      {confirmedBooking && (
        <TicketConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
}
