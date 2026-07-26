const BASE_URL = 'https://api.parvatiyavahan.com';

// Auth helpers
export const getToken = () => localStorage.getItem('admin_token');
export const setToken = (token) => localStorage.setItem('admin_token', token);
export const clearToken = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); };

// Intercept all fetch requests to handle 401 Unauthorized globally
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const res = await originalFetch(...args);
  if (res.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    if (!url.includes('/auth/otp/verify') && !url.includes('/auth/otp/send')) {
      clearToken();
      localStorage.removeItem('admin_refresh_token');
      window.dispatchEvent(new Event('admin-unauthorized'));
    }
  }
  return res;
};

// Auth: Send OTP
export const sendLoginOtp = async (mobile) => {
  const res = await fetch(`${BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, purpose: 'LOGIN' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to send OTP');
  return data;
};

// Auth: Verify OTP and get token
export const verifyLoginOtp = async (mobile, otp) => {
  const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, otp, purpose: 'LOGIN' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Invalid OTP');
  // store token
  if (data.data?.accessToken) {
    setToken(data.data.accessToken);
    if (data.data.refreshToken) localStorage.setItem('admin_refresh_token', data.data.refreshToken);
    if (data.data.user) localStorage.setItem('admin_user', JSON.stringify(data.data.user));
  }
  return data;
};

// Auth: Logout
export const logoutAdmin = async () => {
  const refreshToken = localStorage.getItem('admin_refresh_token');
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ refreshToken: refreshToken || '' })
    });
  } catch (_) {}
  clearToken();
  localStorage.removeItem('admin_refresh_token');
};

// Check if server is running
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch (e) {
    return false;
  }
};

// API functions
export const getAdminMe = async () => {
  const res = await fetch(`${BASE_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const listUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return { users: data.data?.users || data.users || data };
};

export const updateUserStatus = async (userId, status) => {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  });
  return res.json();
};

export const listDriverApplications = async () => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const getDriverApplicationDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const verifyDriverDocument = async (appId, docId) => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications/${appId}/documents/${docId}/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const rejectDriverDocument = async (appId, docId, reason) => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications/${appId}/documents/${docId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ reason })
  });
  return res.json();
};

export const approveDriverApplication = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications/${id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const rejectDriverApplication = async (id, reason) => {
  const res = await fetch(`${BASE_URL}/admin/driver-applications/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ reason })
  });
  return res.json();
};

export const listRides = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/admin/rides?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const listBookings = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/admin/bookings?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const listPayments = async () => {
  const res = await fetch(`${BASE_URL}/admin/payments`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const getReportSummary = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports/summary`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return { summary: data.data?.summary || data.summary || data.data || data };
};

export const getPricingSettings = async () => {
  const res = await fetch(`${BASE_URL}/admin/pricing/settings`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return { settings: data.data?.settings || data.settings || data.data || data };
};

export const updatePricingSettings = async (settings) => {
  const res = await fetch(`${BASE_URL}/admin/pricing/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(settings)
  });
  return res.json();
};

export const approveRideCancellation = async (rideId) => {
  const res = await fetch(`${BASE_URL}/admin/rides/${rideId}/cancellation/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const rejectRideCancellation = async (rideId) => {
  const res = await fetch(`${BASE_URL}/admin/rides/${rideId}/cancellation/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const listPackageBookings = async () => {
  const res = await fetch(`${BASE_URL}/admin/package-bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const allocatePackageBooking = async (bookingId, driverId, vehicleId) => {
  const res = await fetch(`${BASE_URL}/admin/package-bookings/${bookingId}/allocate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ driverId, vehicleId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to allocate package booking');
  return data.data || data;
};

// Predefined Locations Management APIs
export const listAdminLocations = async () => {
  const res = await fetch(`${BASE_URL}/admin/locations`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Unauthorized');
  return data.data || data;
};

export const createAdminLocation = async (locationData) => {
  const res = await fetch(`${BASE_URL}/admin/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(locationData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to create location');
  return data.data || data;
};

export const updateAdminLocation = async (id, locationData) => {
  const res = await fetch(`${BASE_URL}/admin/locations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(locationData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to update location');
  return data.data || data;
};

// Stub functions so App.jsx doesn't break if it references old exports
export const getMockMode = () => false;
export const setMockMode = () => {};

