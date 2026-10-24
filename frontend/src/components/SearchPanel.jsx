import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRightLeft, Search, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_CITIES = [
  'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Delhi', 'Jaipur', 'Goa', 'Chennai', 'Ahmedabad'
];

const TODAY_STR = new Date().toISOString().split('T')[0];
const TOMORROW_STR = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

export default function SearchPanel({ initialFrom = '', initialTo = '', initialDate = '' }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [fromCity, setFromCity] = useState(initialFrom || 'Mumbai');
  const [toCity, setToCity] = useState(initialTo || 'Pune');

  const todayStr = TODAY_STR;
  const tomorrowStr = TOMORROW_STR;

  const [journeyDate, setJourneyDate] = useState(initialDate || todayStr);
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    api.getCities()
      .then((res) => {
        if (res && res.length > 0) setCities(res);
      })
      .catch(() => {});
  }, []);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: journeyDate,
      passengers: passengers.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="search-box-container container">
      <div className="search-box">
        <form onSubmit={handleSearch}>
          <div className="search-grid">
            {/* From City */}
            <div className="search-input-group">
              <label className="search-input-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#2563EB" /> From City
                </span>
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="search-input-field"
                required
              >
                {cities.map((c) => (
                  <option key={`from-${c}`} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleSwap}
                className="search-swap-btn"
                title="Swap source and destination"
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            {/* To City */}
            <div className="search-input-group">
              <label className="search-input-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#EA580C" /> Destination
                </span>
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="search-input-field"
                required
              >
                {cities.map((c) => (
                  <option key={`to-${c}`} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="search-input-group">
              <label className="search-input-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} color="#2563EB" /> Date of Journey
                </span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="search-input-field"
                required
              />
            </div>

            {/* Passengers */}
            <div className="search-input-group">
              <label className="search-input-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} color="#2563EB" /> Passengers
                </span>
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="search-input-field"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="btn-accent"
                style={{ width: '100%', height: '54px', borderRadius: '12px' }}
              >
                <Search size={20} />
                <span>Search Buses</span>
              </button>
            </div>
          </div>

          {/* Quick Date Shortcuts Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #F1F5F9',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Quick Dates:</span>
            <button
              type="button"
              onClick={() => setJourneyDate(todayStr)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: journeyDate === todayStr ? '#EFF6FF' : '#F8FAFC',
                border: `1px solid ${journeyDate === todayStr ? '#3B82F6' : '#E2E8F0'}`,
                color: journeyDate === todayStr ? '#1D4ED8' : '#475569',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setJourneyDate(tomorrowStr)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: journeyDate === tomorrowStr ? '#EFF6FF' : '#F8FAFC',
                border: `1px solid ${journeyDate === tomorrowStr ? '#3B82F6' : '#E2E8F0'}`,
                color: journeyDate === tomorrowStr ? '#1D4ED8' : '#475569',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Tomorrow
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>
              <Sparkles size={14} /> Zero convenience fee on all bookings
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
