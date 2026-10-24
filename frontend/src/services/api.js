// =====================================================================
// BusGo API Client
// Connects to Java 21 Spring Boot Backend on http://localhost:8080/api
// =====================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('busgo_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/user/profile'),
  updateProfile: (profileData) => request('/user/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Buses & Schedules
  searchBuses: (from, to, date) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    return request(`/buses/search?${params.toString()}`);
  },
  getPopularRoutes: () => request('/buses/popular-routes'),
  getCities: () => request('/buses/cities'),
  getHolidayPlans: () => request('/holiday-plans'),
  getSeats: (scheduleId, date) => {
    const params = date ? `?date=${date}` : '';
    return request(`/buses/schedule/${scheduleId}/seats${params}`);
  },

  // Bookings
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyBookings: () => request('/bookings/my-bookings'),
  getBookingByReference: (reference) => request(`/bookings/${reference}`),
  cancelBooking: (bookingId, cancellation) => request(`/bookings/${bookingId}/cancel`, {
    method: 'POST',
    body: JSON.stringify(cancellation),
  }),

  // AI Travel Assistant
  chatAi: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Admin Endpoints
  getAdminStats: () => request('/admin/stats'),
  getAdminBuses: () => request('/admin/buses'),
  addAdminBus: (busData) => request('/admin/buses', { method: 'POST', body: JSON.stringify(busData) }),
  deleteAdminBus: (busId) => request(`/admin/buses/${busId}`, { method: 'DELETE' }),

  getAdminRoutes: () => request('/admin/routes'),
  addAdminRoute: (routeData) => request('/admin/routes', { method: 'POST', body: JSON.stringify(routeData) }),
  deleteAdminRoute: (routeId) => request(`/admin/routes/${routeId}`, { method: 'DELETE' }),

  getAdminSchedules: () => request('/admin/schedules'),
  addAdminSchedule: (scheduleData) => request('/admin/schedules', { method: 'POST', body: JSON.stringify(scheduleData) }),
  deleteAdminSchedule: (scheduleId) => request(`/admin/schedules/${scheduleId}`, { method: 'DELETE' }),

  getAdminHolidayPlans: () => request('/admin/holiday-plans'),
  addAdminHolidayPlan: (planData) => request('/admin/holiday-plans', { method: 'POST', body: JSON.stringify(planData) }),
  updateAdminHolidayPlan: (planId, planData) => request(`/admin/holiday-plans/${planId}`, { method: 'PUT', body: JSON.stringify(planData) }),
  deleteAdminHolidayPlan: (planId) => request(`/admin/holiday-plans/${planId}`, { method: 'DELETE' }),

  getAdminBookings: () => request('/admin/bookings'),
  getAdminUsers: () => request('/admin/users'),
  toggleUserRole: (userId) => request(`/admin/users/${userId}/toggle-role`, { method: 'POST' }),
};
