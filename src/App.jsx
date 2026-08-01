import React, { useState, useEffect } from 'react';
import * as api from './apiService';
import logo from './assets/logo.png';
import './App.css';

// Inline SVG Icon Components for a premium look
const Icons = {
  Dashboard: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  Users: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Drivers: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Rides: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Bookings: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Pricing: () => (
    <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Search: () => (
    <svg style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ThemeLight: () => (
    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  ThemeDark: () => (
    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Check: () => (
    <svg style={{ width: '14px', height: '14px', color: 'var(--success)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Cross: () => (
    <svg style={{ width: '14px', height: '14px', color: 'var(--error)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: () => (
    <svg style={{ width: '14px', height: '14px', color: 'var(--warning)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const useMock = false;
  const [backendOnline, setBackendOnline] = useState(false);

  // Packages state
  const [packageBookings, setPackageBookings] = useState([]);
  const [loadingPackageBookings, setLoadingPackageBookings] = useState(false);
  const [selectedPackageBooking, setSelectedPackageBooking] = useState(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocationDriverId, setAllocationDriverId] = useState('');
  const [packageBookingPage, setPackageBookingPage] = useState(1);
  const [packageBookingLimit, setPackageBookingLimit] = useState(10);
  const [copiedId, setCopiedId] = useState('');

  // Predefined Locations state
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [locationModalError, setLocationModalError] = useState('');
  const [savingLocation, setSavingLocation] = useState(false);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(!!api.getToken());
  const [loginMobile, setLoginMobile] = useState('+91');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccessMsg] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // 401 logout helper
  const handleUnauthorized = () => {
    api.clearToken();
    setIsLoggedIn(false);
  };

  // Dashboard state
  const [reports, setReports] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Pagination States
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(10);

  const [driverAppPage, setDriverAppPage] = useState(1);
  const [driverAppLimit, setDriverAppLimit] = useState(10);

  const [ridePage, setRidePage] = useState(1);
  const [rideLimit, setRideLimit] = useState(10);
  const [rideTotalPages, setRideTotalPages] = useState(1);
  const [rideTotal, setRideTotal] = useState(0);

  const [bookingPage, setBookingPage] = useState(1);
  const [bookingLimit, setBookingLimit] = useState(10);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [bookingTotal, setBookingTotal] = useState(0);

  const navigateToTab = (tab) => {
    setCurrentTab(tab);
    setUserPage(1);
    setDriverAppPage(1);
    setRidePage(1);
    setBookingPage(1);
    setPackageBookingPage(1);
  };

  const handleRideLimitChange = (newLimit) => {
    setRideLimit(newLimit);
    setRidePage(1);
  };

  const handleBookingLimitChange = (newLimit) => {
    setBookingLimit(newLimit);
    setBookingPage(1);
  };

  const handleUserLimitChange = (newLimit) => {
    setUserLimit(newLimit);
    setUserPage(1);
  };

  const handleDriverAppLimitChange = (newLimit) => {
    setDriverAppLimit(newLimit);
    setDriverAppPage(1);
  };

  // Driver apps state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppVehicle, setSelectedAppVehicle] = useState(null);
  const [appDocuments, setAppDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDocRejectModal, setShowDocRejectModal] = useState(false);
  const [showAppRejectModal, setShowAppRejectModal] = useState(false);
  const [applicationRejectReason, setApplicationRejectReason] = useState('');

  // Document Viewer visual helpers
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Rides & Bookings state
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Pricing Settings state
  const [pricing, setPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // Alert message
  const [alert, setAlert] = useState(null);

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Check backend health on mount and handle global unauthorized redirect
  useEffect(() => {
    const checkHealth = async () => {
      const online = await api.checkBackendHealth();
      setBackendOnline(online);
    };
    checkHealth();

    const handleUnauthorizedEvent = () => {
      setIsLoggedIn(false);
      triggerAlert('error', 'Session expired. Please login again.');
    };
    window.addEventListener('admin-unauthorized', handleUnauthorizedEvent);
    return () => window.removeEventListener('admin-unauthorized', handleUnauthorizedEvent);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  // Handle send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await api.sendLoginOtp(loginMobile);
      setOtpSent(true);
      setOtpCountdown(60);
      setLoginSuccessMsg('OTP sent successfully!');
    } catch (err) {
      setLoginError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await api.verifyLoginOtp(loginMobile, loginOtp);
      setIsLoggedIn(true);
      setOtpSent(false);
      setLoginOtp('');
      setLoginMobile('+91');
    } catch (err) {
      setLoginError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await api.logoutAdmin();
    setIsLoggedIn(false);
    setOtpSent(false);
    setLoginMobile('+91');
    setLoginOtp('');
  };

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load tab data
  useEffect(() => {
    if (isLoggedIn) {
      loadTabContent();
    }
  }, [currentTab, useMock, isLoggedIn, ridePage, rideLimit, bookingPage, bookingLimit, packageBookingPage, packageBookingLimit]);

  const loadTabContent = async () => {
    try {
      if (currentTab === 'dashboard') {
        setLoadingReports(true);
        const data = await api.getReportSummary();
        setReports(data.summary);
      } else if (currentTab === 'users') {
        setLoadingUsers(true);
        const data = await api.listUsers();
        setUsers(data.users);
      } else if (currentTab === 'drivers') {
        setLoadingApps(true);
        const data = await api.listDriverApplications();
        setApplications(data.applications || []);
        // Reset selections
        setSelectedApp(null);
        setSelectedAppVehicle(null);
        setAppDocuments([]);
        setSelectedDoc(null);
      } else if (currentTab === 'rides') {
        setLoadingRides(true);
        const data = await api.listRides(ridePage, rideLimit);
        setRides(data.rides || []);
        setRideTotalPages(data.pagination?.pages || 1);
        setRideTotal(data.pagination?.total || 0);
      } else if (currentTab === 'bookings') {
        setLoadingBookings(true);
        const data = await api.listBookings(bookingPage, bookingLimit);
        setBookings(data.bookings || []);
        setBookingTotalPages(data.pagination?.pages || 1);
        setBookingTotal(data.pagination?.total || 0);
      } else if (currentTab === 'pricing') {
        setLoadingPricing(true);
        const data = await api.getPricingSettings();
        setPricing(data.settings);
      } else if (currentTab === 'packages') {
        setLoadingPackageBookings(true);
        const [bookingsData, usersData] = await Promise.all([
          api.listPackageBookings(),
          api.listUsers(1, 1000).catch(() => ({ users: [] }))
        ]);
        setPackageBookings(bookingsData.bookings || []);
        setUsers(usersData.users || []);
      } else if (currentTab === 'locations') {
        setLoadingLocations(true);
        const data = await api.listAdminLocations();
        setLocations(data.locations || []);
      }
    } catch (err) {
      console.error(err);
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        handleUnauthorized();
        return;
      }
      triggerAlert('error', `Failed to load ${currentTab} data.`);
    } finally {
      setLoadingReports(false);
      setLoadingUsers(false);
      setLoadingApps(false);
      setLoadingRides(false);
      setLoadingBookings(false);
      setLoadingPricing(false);
      setLoadingPackageBookings(false);
      setLoadingLocations(false);
    }
  };


  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Location Actions
  const handleOpenAddLocationModal = () => {
    setSelectedLocation(null);
    setLocationName('');
    setLocationLat('');
    setLocationLng('');
    setLocationModalError('');
    setShowLocationModal(true);
  };

  const handleOpenEditLocationModal = (loc) => {
    setSelectedLocation(loc);
    setLocationName(loc.name);
    setLocationLat(loc.latitude !== undefined && loc.latitude !== null ? loc.latitude.toString() : '');
    setLocationLng(loc.longitude !== undefined && loc.longitude !== null ? loc.longitude.toString() : '');
    setLocationModalError('');
    setShowLocationModal(true);
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locationName.trim()) {
      setLocationModalError('Location name is required.');
      return;
    }
    setSavingLocation(true);
    setLocationModalError('');

    const payload = {
      name: locationName.trim(),
      latitude: locationLat.trim() ? parseFloat(locationLat) : undefined,
      longitude: locationLng.trim() ? parseFloat(locationLng) : undefined,
    };

    try {
      if (selectedLocation) {
        // Edit location
        const res = await api.updateAdminLocation(selectedLocation._id || selectedLocation.id, payload);
        const updated = res.location || res.data || res;
        setLocations(prev => prev.map(l => (l._id === (selectedLocation._id || selectedLocation.id) || l.id === (selectedLocation._id || selectedLocation.id)) ? { ...l, ...updated } : l));
        triggerAlert('success', 'Location updated successfully.');
      } else {
        // Add location
        const res = await api.createAdminLocation(payload);
        const created = res.location || res.data || res;
        setLocations(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        triggerAlert('success', 'Location added successfully.');
      }
      setShowLocationModal(false);
    } catch (err) {
      setLocationModalError(err.message || 'Failed to save location.');
    } finally {
      setSavingLocation(false);
    }
  };

  const handleToggleLocationStatus = async (loc) => {
    const locId = loc._id || loc.id;
    const nextActive = !loc.isActive;
    try {
      await api.updateAdminLocation(locId, { isActive: nextActive });
      setLocations(prev => prev.map(l => (l._id === locId || l.id === locId) ? { ...l, isActive: nextActive } : l));
      triggerAlert('success', `Location ${nextActive ? 'enabled' : 'disabled'} successfully.`);
    } catch (err) {
      triggerAlert('error', 'Failed to update location status.');
    }
  };

  // User Actions
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await api.updateUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => {
        if (u.id === userId || u._id === userId) {
          return {
            ...u,
            accountStatus: nextStatus,
            capabilities: {
              ...u.capabilities,
              canBookRide: nextStatus === 'ACTIVE'
            }
          };
        }
        return u;
      }));
      triggerAlert('success', `User status updated to ${nextStatus}.`);
    } catch (err) {
      triggerAlert('error', 'Failed to update user status.');
    }
  };

  // Document actions
  const selectApplication = async (app) => {
    try {
      setSelectedApp(app);
      const detail = await api.getDriverApplicationDetail(app.id);
      setAppDocuments(detail.documents);
      setSelectedAppVehicle(detail.vehicle || null);
      if (detail.documents.length > 0) {
        setSelectedDoc(detail.documents[0]);
      }
      setZoom(1);
      setRotation(0);
    } catch (err) {
      triggerAlert('error', 'Failed to load application documents.');
    }
  };

  const handleVerifyDocument = async () => {
    if (!selectedApp || !selectedDoc) return;
    try {
      await api.verifyDriverDocument(selectedApp.id, selectedDoc.id);
      setAppDocuments(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'VERIFIED', rejectionReason: undefined } : d));
      setSelectedDoc(prev => ({ ...prev, status: 'VERIFIED', rejectionReason: undefined }));
      triggerAlert('success', 'Document verified successfully.');
    } catch (err) {
      triggerAlert('error', 'Failed to verify document.');
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedApp || !selectedDoc || !rejectionReason.trim()) return;
    try {
      await api.rejectDriverDocument(selectedApp.id, selectedDoc.id, rejectionReason);
      setAppDocuments(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'REJECTED', rejectionReason } : d));
      setSelectedDoc(prev => ({ ...prev, status: 'REJECTED', rejectionReason }));
      setRejectionReason('');
      setShowDocRejectModal(false);
      triggerAlert('warning', 'Document rejected.');
    } catch (err) {
      triggerAlert('error', 'Failed to reject document.');
    }
  };

  const handleApproveApplication = async () => {
    if (!selectedApp) return;
    try {
      await api.approveDriverApplication(selectedApp.id);
      setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
      setSelectedApp(null);
      setAppDocuments([]);
      setSelectedDoc(null);
      triggerAlert('success', 'Driver application approved successfully! Role granted.');
    } catch (err) {
      triggerAlert('error', err.message || 'All documents must be verified first.');
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApp || !applicationRejectReason.trim()) return;
    try {
      await api.rejectDriverApplication(selectedApp.id, applicationRejectReason);
      setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
      setSelectedApp(null);
      setAppDocuments([]);
      setSelectedDoc(null);
      setApplicationRejectReason('');
      setShowAppRejectModal(false);
      triggerAlert('warning', 'Driver application rejected.');
    } catch (err) {
      triggerAlert('error', 'Failed to reject application.');
    }
  };

  const handleApproveCancellation = async (rideId) => {
    try {
      const res = await api.approveRideCancellation(rideId);
      if (res.error) {
        triggerAlert('error', res.error.message || 'Failed to approve cancellation.');
        return;
      }
      setRides(prev => prev.map(ride => {
        if (ride.id === rideId) {
          return { ...ride, status: 'CANCELLED', availableSeats: 0, heldSeats: 0, bookedSeats: 0 };
        }
        return ride;
      }));
      triggerAlert('success', 'Ride cancellation approved successfully.');
    } catch (err) {
      triggerAlert('error', err.message || 'Failed to approve cancellation.');
    }
  };

  const handleRejectCancellation = async (rideId) => {
    try {
      const res = await api.rejectRideCancellation(rideId);
      if (res.error) {
        triggerAlert('error', res.error.message || 'Failed to reject cancellation.');
        return;
      }
      setRides(prev => prev.map(ride => {
        if (ride.id === rideId) {
          return { ...ride, status: 'PUBLISHED' };
        }
        return ride;
      }));
      triggerAlert('success', 'Ride cancellation rejected. Ride is active again.');
    } catch (err) {
      triggerAlert('error', err.message || 'Failed to reject cancellation.');
    }
  };

  const handleOpenAllocateModal = (booking) => {
    setSelectedPackageBooking(booking);
    setAllocationDriverId('');
    setShowAllocateModal(true);
  };

  const handleAllocateBooking = async (e) => {
    e.preventDefault();
    if (!selectedPackageBooking || !allocationDriverId) return;

    const driver = users.find(u => (u.id === allocationDriverId || u._id === allocationDriverId));
    if (!driver || !driver.vehicle) {
      triggerAlert('error', 'Selected driver does not have an active registered vehicle.');
      return;
    }

    try {
      await api.allocatePackageBooking(selectedPackageBooking.id, allocationDriverId, driver.vehicle.id || driver.vehicle._id);
      triggerAlert('success', 'Package booking allocated successfully.');
      setShowAllocateModal(false);
      loadTabContent();
    } catch (err) {
      triggerAlert('error', err.message || 'Failed to allocate package booking.');
    }
  };

  // Pricing Form Submit
  const handleSavePricing = async (e) => {
    e.preventDefault();
    setSavingPricing(true);
    try {
      await api.updatePricingSettings(pricing);
      setPricingSuccess(true);
      setTimeout(() => setPricingSuccess(false), 3000);
      triggerAlert('success', 'Pricing settings updated.');
    } catch (err) {
      triggerAlert('error', 'Failed to update settings.');
    }
    setSavingPricing(false);
  };

  const handlePricingChange = (key, value) => {
    setPricing(prev => ({ ...prev, [key]: value }));
  };

  // Filtering users
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'ALL' && !u.roles?.includes(userRoleFilter)) {
      return false;
    }
    return (
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobile?.includes(userSearch) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const paginatedUsers = filteredUsers.slice((userPage - 1) * userLimit, userPage * userLimit);
  const paginatedDriverApps = applications.slice((driverAppPage - 1) * driverAppLimit, driverAppPage * driverAppLimit);

  const renderRoutePoint = (point) => {
    if (!point) return 'N/A';
    if (typeof point === 'object') {
      return point.location || point.name || 'N/A';
    }
    return point;
  };

  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/')) {
      return `https://api.parvatiyavahan.com${url}`;
    }
    return url;
  };

  const renderPagination = (currentPage, totalPages, limit, totalEntries, onPageChange, onLimitChange, isTop = false) => {
    if (totalPages <= 1 && totalEntries <= 10) return null;

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalEntries);

    return (
      <div className="pagination-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isTop ? '0' : '1.5rem',
        marginBottom: isTop ? '1.25rem' : '0',
        paddingTop: isTop ? '0' : '1rem',
        paddingBottom: isTop ? '1rem' : '0',
        borderTop: isTop ? 'none' : '1px solid var(--border)',
        borderBottom: isTop ? '1px solid var(--border)' : 'none',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
          Showing <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{totalEntries > 0 ? startEntry : 0}</span> to <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{endEntry}</span> of <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{totalEntries}</span> entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Show</span>
            <select
              className="form-control"
              style={{ width: '80px', padding: '0.4rem 0.5rem', cursor: 'pointer', fontWeight: 700 }}
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>entries</span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span style={{ padding: '0.4rem 0.5rem', color: 'var(--text-muted)' }}>...</span>}
                    <button
                      className={`btn ${currentPage === p ? 'btn-primary' : 'btn-outline'}`}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        minWidth: '34px',
                        background: currentPage === p ? 'linear-gradient(135deg, var(--primary), #FFB300)' : 'transparent',
                        borderColor: currentPage === p ? 'transparent' : 'var(--border)',
                        color: currentPage === p ? 'white' : 'inherit'
                      }}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===================== LOGIN SCREEN =====================
  if (!isLoggedIn) {
    return (
      <div className="login-container" data-theme={theme}>
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="Parvatiya Vahan" className="login-logo" />
            <h1 className="login-title">Parvatiya Vahan</h1>
            <p className="login-subtitle">Admin Control Panel</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="login-form">
              <h2 className="login-form-title">Sign In with OTP</h2>
              <p className="login-form-hint">Enter your registered admin mobile number to receive an OTP.</p>
              
              {loginError && <div className="login-error">{loginError}</div>}
              {loginSuccess && <div className="login-success-msg">{loginSuccess}</div>}
              
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control login-input"
                  placeholder="+91 9999999999"
                  value={loginMobile}
                  onChange={e => {
                    let val = e.target.value;
                    if (!val.startsWith('+91')) {
                      val = '+91' + val.replace(/^\+?9?1?/, '');
                    }
                    const digits = val.slice(3).replace(/\D/g, '');
                    setLoginMobile('+91' + digits.slice(0, 10));
                  }}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary login-btn"
                disabled={loginLoading || loginMobile.length < 13}
              >
                {loginLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <h2 className="login-form-title">Enter OTP</h2>
              <p className="login-form-hint">Enter the 6-digit OTP sent to <strong>{loginMobile}</strong></p>
              
              {loginError && <div className="login-error">{loginError}</div>}
              {loginSuccess && <div className="login-success-msg">{loginSuccess}</div>}

              <div className="form-group">
                <label className="form-label">One-Time Password</label>
                <input
                  type="text"
                  className="form-control login-input otp-input"
                  placeholder="000000"
                  maxLength={6}
                  value={loginOtp}
                  onChange={e => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary login-btn"
                disabled={loginLoading || loginOtp.length < 4}
              >
                {loginLoading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                className="btn btn-outline login-btn-secondary"
                onClick={() => { setOtpSent(false); setLoginOtp(''); setLoginError(''); }}
              >
                ← Change Number
              </button>

              {otpCountdown > 0 ? (
                <p className="otp-timer">Resend OTP in {otpCountdown}s</p>
              ) : (
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleSendOtp}
                  disabled={loginLoading}
                >
                  Resend OTP
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    );
  }
  // ===================== END LOGIN SCREEN =====================

  return (
    <div className="app-container">
      {/* Alert Notification Box */}
      {alert && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '1.15rem 1.75rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: alert.type === 'success' ? 'var(--success)' : alert.type === 'error' ? 'var(--error)' : 'var(--warning)',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {alert.type === 'success' && <Icons.Check />}
          {alert.type === 'error' && <Icons.Cross />}
          {alert.type === 'warning' && <Icons.Clock />}
          {alert.message}
        </div>
      )}

      {/* Sleek Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Parvatiya Vahan Logo" className="sidebar-logo" />
          <div className="brand-text">
            <h1>Parvatiya Vahan</h1>
            <span>Admin Control Panel</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateToTab('dashboard')}
          >
            <Icons.Dashboard />
            Dashboard
          </button>
          <button 
            className={`menu-item ${currentTab === 'users' ? 'active' : ''}`}
            onClick={() => navigateToTab('users')}
          >
            <Icons.Users />
            Users
          </button>
          <button 
            className={`menu-item ${currentTab === 'drivers' ? 'active' : ''}`}
            onClick={() => navigateToTab('drivers')}
          >
            <Icons.Drivers />
            Driver Apps
          </button>
          <button 
            className={`menu-item ${currentTab === 'rides' ? 'active' : ''}`}
            onClick={() => navigateToTab('rides')}
          >
            <Icons.Rides />
            Rides
          </button>
          <button 
            className={`menu-item ${currentTab === 'bookings' ? 'active' : ''}`}
            onClick={() => navigateToTab('bookings')}
          >
            <Icons.Bookings />
            Bookings
          </button>
          <button 
            className={`menu-item ${currentTab === 'pricing' ? 'active' : ''}`}
            onClick={() => navigateToTab('pricing')}
          >
            <Icons.Pricing />
            Pricing & Surge
          </button>
          <button 
            className={`menu-item ${currentTab === 'packages' ? 'active' : ''}`}
            onClick={() => navigateToTab('packages')}
          >
            <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Packages
          </button>
          <button 
            className={`menu-item ${currentTab === 'locations' ? 'active' : ''}`}
            onClick={() => navigateToTab('locations')}
          >
            <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Locations
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.65rem 0.85rem', color: '#8D9E95', borderColor: '#22382B', display: 'flex', gap: '0.5rem', justifyContent: 'center', width: '100%' }}>
            {theme === 'light' ? <Icons.ThemeDark /> : <Icons.ThemeLight />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace('-', ' ')}</h2>
          </div>
        <div className="header-actions">
            {backendOnline ? (
              <span className="api-status-badge live">
                <span className="pulse-dot"></span> Live API
              </span>
            ) : (
              <span className="api-status-badge mock" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <span className="pulse-dot" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' }}></span> API Offline
              </span>
            )}
            
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <span className="profile-name">Administrator</span>
                <span className="profile-role">Super Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="tab-content animate-fade-in">
          
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <div>
              {loadingReports ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading dashboard metrics...</div>
              ) : reports ? (
                <div>
                  <div className="stats-grid stats-grid-wide">
                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('bookings')}>
                      <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">₹{reports.payments.totalAmount.toLocaleString()}</span>
                        <span className="stat-trend positive">✓ {reports.payments.successful} Successful</span>
                      </div>
                      <div className="stat-icon-wrapper green">₹</div>
                    </div>

                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('rides')}>
                      <div className="stat-info">
                        <span className="stat-label">Total Rides</span>
                        <span className="stat-value">{reports.rides.total}</span>
                        <span className="stat-trend positive">✓ {reports.rides.completed} Completed</span>
                      </div>
                      <div className="stat-icon-wrapper orange">🚗</div>
                    </div>

                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('bookings')}>
                      <div className="stat-info">
                        <span className="stat-label">Bookings</span>
                        <span className="stat-value">{reports.bookings.total}</span>
                        <span className="stat-trend positive">✓ {reports.bookings.confirmed} Active</span>
                      </div>
                      <div className="stat-icon-wrapper blue">🎫</div>
                    </div>

                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('users')}>
                      <div className="stat-info">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{reports.users.totalUsers ?? reports.users.totalPassengers}</span>
                        <span className="stat-trend positive">+{reports.users.newThisMonth} This Month</span>
                      </div>
                      <div className="stat-icon-wrapper red">👥</div>
                    </div>

                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('drivers')}>
                      <div className="stat-info">
                        <span className="stat-label">Approved Drivers</span>
                        <span className="stat-value">{reports.users.approvedDrivers ?? reports.users.totalDrivers ?? 0}</span>
                        <span className="stat-trend positive">✓ {reports.users.totalDrivers ?? 0} Total Drivers</span>
                      </div>
                      <div className="stat-icon-wrapper green" style={{ fontSize: '1.4rem' }}>🧑‍✈️</div>
                    </div>

                    <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => navigateToTab('drivers')}>
                      <div className="stat-info">
                        <span className="stat-label">Pending Driver Apps</span>
                        <span className="stat-value" style={{ color: (reports.users.pendingDrivers ?? 0) > 0 ? 'var(--warning)' : 'inherit' }}>
                          {reports.users.pendingDrivers ?? 0}
                        </span>
                        <span className="stat-trend" style={{ color: (reports.users.pendingDrivers ?? 0) > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {(reports.users.pendingDrivers ?? 0) > 0 ? '⚠ Action Required' : '✓ All Clear'}
                        </span>
                      </div>
                      <div className="stat-icon-wrapper orange" style={{ fontSize: '1.4rem' }}>📋</div>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    <div className="card">
                      <div className="chart-header">
                        <h3>Revenue by Payment Method</h3>
                      </div>
                      <div className="chart-bar-container" style={{ marginTop: '1.5rem' }}>
                        {Object.entries(reports.revenue.totalByPaymentMethod).map(([method, amount]) => {
                          const total = reports.revenue.totalCollected || 1;
                          const percent = Math.round((amount / total) * 100);
                          return (
                            <div className="bar-row" key={method}>
                              <div className="bar-label-group">
                                <span style={{ fontWeight: 700 }}>{method}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>₹{amount.toLocaleString()} ({percent}%)</span>
                              </div>
                              <div className="bar-track">
                                <div 
                                  className="bar-fill orange" 
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card">
                      <div className="chart-header">
                        <h3>Popular Hill Routes</h3>
                      </div>
                      <div className="route-list" style={{ marginTop: '1rem' }}>
                        {reports.revenue.topRoutes.map((route, i) => (
                          <div className="route-item" key={i}>
                            <div className="route-meta">
                              <span className="route-names">{route.route}</span>
                              <span className="route-trips">{route.count} trips booked</span>
                            </div>
                            <span className="route-revenue">₹{route.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No reports loaded.</div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {currentTab === 'users' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>Users Database</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select 
                    className="form-control"
                    style={{ width: '160px', padding: '0.65rem 1rem', cursor: 'pointer', fontWeight: 600 }}
                    value={userRoleFilter}
                    onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="PASSENGER">Passengers</option>
                    <option value="DRIVER">Drivers</option>
                    <option value="ADMIN">Admins</option>
                  </select>

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: '16px', display: 'flex' }}>
                      <Icons.Search />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search by name, email or phone..." 
                      className="form-control"
                      style={{ width: '320px', paddingLeft: '44px' }}
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                    />
                  </div>
                </div>
              </div>

              {loadingUsers ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading users database...</div>
              ) : (
                <>
                  {renderPagination(userPage, Math.ceil(filteredUsers.length / userLimit), userLimit, filteredUsers.length, setUserPage, handleUserLimitChange, true)}
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Name</th>
                          <th>Contact</th>
                          <th>Roles</th>
                          <th>Account Status</th>
                          <th>Driver Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((user) => (
                          <tr key={user.id || user._id}>
                            <td>
                              <img 
                                src={resolveImageUrl(user.profilePhotoUrl) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"} 
                                alt="Avatar" 
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                              />
                            </td>
                            <td style={{ fontWeight: 700 }}>{user.name || "N/A"}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{user.mobile}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{user.email || 'No Email'}</div>
                            </td>
                            <td>
                              {user.roles.map(r => (
                                <span key={r} className={`badge ${r === 'ADMIN' ? 'badge-info' : r === 'DRIVER' ? 'badge-warning' : 'badge-success'}`} style={{ marginRight: '4px' }}>
                                  {r}
                                </span>
                              ))}
                            </td>
                            <td>
                              <span className={`badge ${user.accountStatus === 'ACTIVE' ? 'badge-success' : 'badge-error'}`}>
                                {user.accountStatus === 'ACTIVE' ? <Icons.Check /> : <Icons.Cross />}
                                {user.accountStatus}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.driverStatus === 'APPROVED' ? 'badge-success' : user.driverStatus === 'IN_REVIEW' ? 'badge-warning' : 'badge-info'}`}>
                                {user.driverStatus === 'APPROVED' && <Icons.Check />}
                                {user.driverStatus === 'IN_REVIEW' && <Icons.Clock />}
                                {user.driverStatus === 'NOT_APPLIED' && <Icons.Cross />}
                                {user.driverStatus.replace('_', ' ')}
                              </span>
                              {user.vehicle && (
                                <div style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--text-muted)',
                                  marginTop: '6px',
                                  padding: '4px 8px',
                                  backgroundColor: 'var(--bg-main)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border)',
                                  maxWidth: '200px',
                                  lineHeight: '1.3'
                                }}>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                    🚗 {user.vehicle.make} {user.vehicle.model}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{user.vehicle.registrationNumber}</span>
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    {user.vehicle.color} • Seats: {user.vehicle.seatCapacity}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>
                              <button 
                                onClick={() => handleToggleUserStatus(user.id || user._id, user.accountStatus)}
                                className={`btn ${user.accountStatus === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                              >
                                {user.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(userPage, Math.ceil(filteredUsers.length / userLimit), userLimit, filteredUsers.length, setUserPage, handleUserLimitChange, false)}
                </>
              )}
            </div>
          )}

          {/* DRIVERS APPLICATIONS TAB */}
          {currentTab === 'drivers' && (
            <div>
              {!selectedApp ? (
                <div className="card">
                  <h3>Pending Driver Registrations & Document Reviews</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '800px' }}>
                    Drivers must submit and have all 8 required certificates verified (DL, RC, Insurance, Hill Permits, PCC) before they are granted permissions to offer rides. Click 'Verify Documents' to review.
                  </p>

                  {loadingApps ? (
                    <div style={{ color: 'var(--text-muted)' }}>Loading applications list...</div>
                  ) : applications.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                      No pending applications are currently in review.
                    </div>
                  ) : (
                    <>
                      {renderPagination(driverAppPage, Math.ceil(applications.length / driverAppLimit), driverAppLimit, applications.length, setDriverAppPage, handleDriverAppLimitChange, true)}
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Applicant</th>
                              <th>Contact</th>
                              <th>Vehicle details</th>
                              <th>Applied Date</th>
                              <th>Docs Status</th>
                              <th>Notes</th>
                              <th>Review</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedDriverApps.map((app) => (
                              <tr key={app.id}>
                                <td style={{ fontWeight: 700 }}>{app.user?.name || "Driver Candidate"}</td>
                                <td style={{ fontWeight: 600 }}>{app.user?.mobile}</td>
                                <td>
                                  {app.vehicle ? (
                                    <div>
                                      <div style={{ fontWeight: 700 }}>{app.vehicle.make} {app.vehicle.model}</div>
                                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        <span style={{ fontFamily: 'monospace' }}>{app.vehicle.registrationNumber}</span> | Seats: {app.vehicle.seatCapacity}
                                      </div>
                                    </div>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>No vehicle registered</span>
                                  )}
                                </td>
                                <td>{new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td>
                                  <span className="badge badge-warning">
                                    <Icons.Clock />
                                    IN REVIEW ({app.documentCount}/8)
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{app.notes || 'No notes provided'}</td>
                                <td>
                                  <button 
                                    onClick={() => selectApplication(app)}
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                  >
                                    Verify Documents
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {renderPagination(driverAppPage, Math.ceil(applications.length / driverAppLimit), driverAppLimit, applications.length, setDriverAppPage, handleDriverAppLimitChange, false)}
                    </>
                  )}
                </div>
              ) : (
                /* Split screen verification view */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => setSelectedApp(null)}>
                      ← Back to Applications List
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        className="btn btn-danger"
                        onClick={() => setShowAppRejectModal(true)}
                      >
                        Reject Application
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleApproveApplication}
                        // Check if all docs are verified
                        disabled={appDocuments.some(d => d.status !== 'VERIFIED')}
                        style={{
                          opacity: appDocuments.some(d => d.status !== 'VERIFIED') ? 0.5 : 1,
                          cursor: appDocuments.some(d => d.status !== 'VERIFIED') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Approve Application & Grant Role
                      </button>
                    </div>
                  </div>

                  <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem' }}>Reviewing: {selectedApp.user?.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mobile: {selectedApp.user?.mobile} | Submitted: {new Date(selectedApp.createdAt).toLocaleString()}</span>
                      </div>
                      
                      {selectedAppVehicle && (
                        <div style={{
                          padding: '0.75rem 1.15rem',
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          fontSize: '0.85rem'
                        }}>
                          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Registered Vehicle</strong>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedAppVehicle.make} {selectedAppVehicle.model} ({selectedAppVehicle.color})</div>
                          <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                            Reg No: <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{selectedAppVehicle.registrationNumber}</span> | Seats: {selectedAppVehicle.seatCapacity}
                          </div>
                        </div>
                      )}
                    </div>
                    {appDocuments.some(d => d.status !== 'VERIFIED') && (
                      <div style={{
                        marginTop: '1.25rem',
                        padding: '1rem',
                        backgroundColor: 'var(--warning-bg)',
                        color: 'var(--warning)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: '1.5px solid var(--warning-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Icons.Clock />
                        Approvable status locked. Some documents are still pending verification or rejected.
                      </div>
                    )}
                  </div>

                  <div className="split-view">
                    {/* Left List of Docs */}
                    <div className="doc-list-panel">
                      {appDocuments.map((doc) => (
                        <div 
                          key={doc.id}
                          className={`doc-list-item ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDoc(doc);
                            setRejectionReason('');
                            setZoom(1);
                            setRotation(0);
                          }}
                        >
                          <div>
                            <div className="doc-title">{doc.documentType.replace('_', ' ')}</div>
                            <div className="doc-meta">{doc.upload?.originalFileName || 'file.jpg'}</div>
                          </div>
                          
                          <span className={`badge ${doc.status === 'VERIFIED' ? 'badge-success' : doc.status === 'REJECTED' ? 'badge-error' : 'badge-warning'}`}>
                            {doc.status === 'VERIFIED' && <Icons.Check />}
                            {doc.status === 'REJECTED' && <Icons.Cross />}
                            {doc.status === 'PENDING_REVIEW' && <Icons.Clock />}
                            {doc.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right Doc Viewer */}
                    {selectedDoc ? (
                      <div className="doc-viewer-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h4 style={{ textTransform: 'uppercase', fontSize: '1.15rem' }}>{selectedDoc.documentType.replace('_', ' ')}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>File: {selectedDoc.upload?.originalFileName} ({(selectedDoc.upload?.sizeBytes / 1024).toFixed(1)} KB)</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {/* Zoom & Rotation controls for premium feel */}
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.65rem' }} onClick={() => setZoom(prev => Math.min(prev + 0.25, 2))}>Zoom +</button>
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.65rem' }} onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}>Zoom -</button>
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.65rem' }} onClick={() => setRotation(prev => (prev + 90) % 360)}>Rotate ↻</button>
                            
                            <span className={`badge ${selectedDoc.status === 'VERIFIED' ? 'badge-success' : selectedDoc.status === 'REJECTED' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
                              {selectedDoc.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {selectedDoc.rejectionReason && (
                          <div style={{
                            marginTop: '1.15rem',
                            padding: '1rem',
                            backgroundColor: 'var(--error-bg)',
                            color: 'var(--error)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            border: '1.5px solid var(--error-border)',
                            fontWeight: 600
                          }}>
                            <strong>Rejection Reason:</strong> {selectedDoc.rejectionReason}
                          </div>
                        )}

                        <div className="doc-preview-wrapper">
                          {selectedDoc.upload?.uploadUrl ? (
                            <img 
                              src={resolveImageUrl(selectedDoc.upload?.uploadUrl)} 
                              alt={selectedDoc.documentType} 
                              className="doc-preview-image"
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`
                              }}
                            />
                          ) : (
                            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No Preview Available</div>
                          )}
                        </div>

                        <div className="doc-actions">
                          {selectedDoc.status !== 'REJECTED' && (
                            <button 
                              className="btn btn-outline"
                              onClick={() => {
                                setRejectionReason('');
                                setShowDocRejectModal(true);
                              }}
                              style={{ color: 'var(--error)', borderColor: 'var(--error-border)', background: 'transparent' }}
                            >
                              Reject Document
                            </button>
                          )}
                          {selectedDoc.status !== 'VERIFIED' && (
                            <button 
                              className="btn btn-primary"
                              onClick={handleVerifyDocument}
                            >
                              ✓ Verify Document
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="doc-viewer-panel" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Select a document from the left list to review.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIDES TAB */}
          {currentTab === 'rides' && (
            <div className="card">
              <h3>Rides Registry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Live active and completed ride-sharing trips created by verified drivers.
              </p>

              {loadingRides ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading rides database...</div>
              ) : (
                <>
                  {renderPagination(ridePage, rideTotalPages, rideLimit, rideTotal, setRidePage, handleRideLimitChange, true)}
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Ride ID</th>
                          <th>Driver</th>
                          <th>Route</th>
                          <th>Departure Time</th>
                          <th>Seat Price</th>
                          <th>Seats (Avail/Total)</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rides.map((ride) => (
                          <tr key={ride.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{ride.id}</td>
                            <td style={{ fontWeight: 600 }}>
                              <div>{ride.driverName}</div>
                              {ride.vehicle && (
                                <div style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--text-muted)',
                                  fontWeight: 500,
                                  marginTop: '4px',
                                  padding: '2px 6px',
                                  backgroundColor: 'var(--bg-main)',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border)',
                                  display: 'inline-block',
                                  lineHeight: '1.2'
                                }}>
                                  🚗 <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ride.vehicle.make} {ride.vehicle.model}</span> ({ride.vehicle.color})
                                  <br />
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{ride.vehicle.registrationNumber}</span>
                                </div>
                              )}
                            </td>
                            <td>
                              <strong>{renderRoutePoint(ride.pickup)}</strong> → <strong>{renderRoutePoint(ride.drop)}</strong>
                            </td>
                            <td>{new Date(ride.departureAt).toLocaleString()}</td>
                            <td style={{ fontWeight: 800, color: 'var(--secondary)' }}>₹{ride.pricePerSeat}</td>
                            <td style={{ fontWeight: 600 }}>{ride.availableSeats} / {ride.totalSeats}</td>
                            <td>
                              <span className={`badge ${
                                ride.status === 'CANCELLATION_REQUESTED' ? 'badge-warning' :
                                ride.status === 'PUBLISHED' ? 'badge-info' :
                                ride.status === 'COMPLETED' ? 'badge-success' : 'badge-error'
                              }`}>
                                {ride.status === 'COMPLETED' && <Icons.Check />}
                                {ride.status === 'PUBLISHED' && <Icons.Clock />}
                                {ride.status === 'CANCELLATION_REQUESTED' && <Icons.Clock />}
                                {ride.status === 'CANCELLED' && <Icons.Cross />}
                                {ride.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              {ride.status === 'CANCELLATION_REQUESTED' ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleApproveCancellation(ride.id)}
                                    className="btn btn-danger"
                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                  >
                                    Approve Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRejectCancellation(ride.id)}
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                  >
                                    Reject Cancel
                                  </button>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(ridePage, rideTotalPages, rideLimit, rideTotal, setRidePage, handleRideLimitChange, false)}
                </>
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {currentTab === 'bookings' && (
            <div className="card">
              <h3>Bookings Registry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Ticketing booking requests and boarding passes generated by passengers.
              </p>

              {loadingBookings ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading bookings database...</div>
              ) : (
                <>
                  {renderPagination(bookingPage, bookingTotalPages, bookingLimit, bookingTotal, setBookingPage, handleBookingLimitChange, true)}
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Passenger</th>
                          <th>Driver</th>
                          <th>Route</th>
                          <th>Ride Date</th>
                          <th>Seats</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{booking.id}</td>
                            <td style={{ fontWeight: 700 }}>{booking.passengerName}</td>
                            <td style={{ fontWeight: 600 }}>
                              <div>{booking.driverName}</div>
                              {booking.vehicle && (
                                <div style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--text-muted)',
                                  fontWeight: 500,
                                  marginTop: '4px',
                                  padding: '2px 6px',
                                  backgroundColor: 'var(--bg-main)',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border)',
                                  display: 'inline-block',
                                  lineHeight: '1.2'
                                }}>
                                  🚗 <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{booking.vehicle.make} {booking.vehicle.model}</span> ({booking.vehicle.color})
                                  <br />
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{booking.vehicle.registrationNumber}</span>
                                </div>
                              )}
                            </td>
                            <td>
                              <strong>{renderRoutePoint(booking.route?.pickup)}</strong> → <strong>{renderRoutePoint(booking.route?.drop)}</strong>
                            </td>
                            <td>{new Date(booking.rideDate).toLocaleString()}</td>
                            <td style={{ fontWeight: 600 }}>{booking.seatsBooked}</td>
                            <td style={{ fontWeight: 800, color: 'var(--secondary)' }}>₹{booking.totalPrice}</td>
                            <td>
                              <span className={`badge ${booking.status === 'CONFIRMED' ? 'badge-info' : booking.status === 'COMPLETED' ? 'badge-success' : 'badge-error'}`}>
                                {booking.status === 'COMPLETED' && <Icons.Check />}
                                {booking.status === 'CONFIRMED' && <Icons.Clock />}
                                {booking.status === 'CANCELLED' && <Icons.Cross />}
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(bookingPage, bookingTotalPages, bookingLimit, bookingTotal, setBookingPage, handleBookingLimitChange, false)}
                </>
              )}
            </div>
          )}

          {/* PRICING TAB */}
          {currentTab === 'pricing' && (
            <div className="card">
              <h3>System Pricing, Surge & Fare Settings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Configure global settings for distance-based fares, service taxes, surge multipliers, and cancellations.
              </p>

              {loadingPricing ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading pricing parameters...</div>
              ) : pricing ? (
                <form onSubmit={handleSavePricing}>
                  <div className="pricing-grid">
                    <div className="form-group">
                      <label className="form-label">Min Fare per Seat (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.minPricePerSeat}
                        onChange={(e) => handlePricingChange('minPricePerSeat', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Max Fare per Seat (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.maxPricePerSeat}
                        onChange={(e) => handlePricingChange('maxPricePerSeat', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Base Rate per KM (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.basePricePerKm}
                        onChange={(e) => handlePricingChange('basePricePerKm', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Platform Service Fee (%)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.serviceFeePercent}
                        onChange={(e) => handlePricingChange('serviceFeePercent', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Service Fee GST (%)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.serviceFeeGstPercent}
                        onChange={(e) => handlePricingChange('serviceFeeGstPercent', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cancellation Charge (%)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.cancellationChargePercent}
                        onChange={(e) => handlePricingChange('cancellationChargePercent', Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Taxi Booking Advance (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={pricing.fullTaxiBookingAdvance ?? 1000}
                        onChange={(e) => handlePricingChange('fullTaxiBookingAdvance', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

                  <h4 style={{ fontSize: '1.15rem' }}>Surge & Peak Hour Parameters</h4>
                  <div className="pricing-grid" style={{ marginTop: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Surge pricing status</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={pricing.surgePricingEnabled}
                            onChange={(e) => handlePricingChange('surgePricingEnabled', e.target.checked)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{pricing.surgePricingEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Peak Multiplier (multiplier factor)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="form-control" 
                        value={pricing.peakHourMultiplier}
                        onChange={(e) => handlePricingChange('peakHourMultiplier', Number(e.target.value))}
                        disabled={!pricing.surgePricingEnabled}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Peak Hours Range (Start/End HR)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="number" 
                          placeholder="Start (0-23)" 
                          className="form-control" 
                          value={pricing.peakHourStart}
                          onChange={(e) => handlePricingChange('peakHourStart', Number(e.target.value))}
                          disabled={!pricing.surgePricingEnabled}
                        />
                        <input 
                          type="number" 
                          placeholder="End (0-23)" 
                          className="form-control" 
                          value={pricing.peakHourEnd}
                          onChange={(e) => handlePricingChange('peakHourEnd', Number(e.target.value))}
                          disabled={!pricing.surgePricingEnabled}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                      type="submit" 
                      className="btn btn-secondary"
                      disabled={savingPricing}
                    >
                      {savingPricing ? 'Saving settings...' : 'Save Pricing Parameters'}
                    </button>
                    {pricingSuccess && (
                      <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Icons.Check /> Settings saved successfully
                      </span>
                    )}
                  </div>
                </form>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No pricing settings loaded.</div>
              )}
            </div>
          )}

          {/* PACKAGES TAB */}
          {currentTab === 'packages' && (
            <div className="card">
              <h3>Packages Booking Registry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Manage bookings for special tour packages (like Chardham) and manually allocate approved drivers.
              </p>

              {loadingPackageBookings ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading package bookings...</div>
              ) : (
                <>
                  {renderPagination(
                    packageBookingPage,
                    Math.ceil(packageBookings.length / packageBookingLimit),
                    packageBookingLimit,
                    packageBookings.length,
                    setPackageBookingPage,
                    (newLimit) => { setPackageBookingLimit(newLimit); setPackageBookingPage(1); },
                    true
                  )}

                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking ID & Passenger</th>
                          <th>Package & Vehicle</th>
                          <th>Pickup & Destinations</th>
                          <th>Travel Date & Status</th>
                          <th>Amount Details</th>
                          <th>Allocated Driver & Vehicle</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packageBookings
                          .slice((packageBookingPage - 1) * packageBookingLimit, packageBookingPage * packageBookingLimit)
                          .map((booking) => (
                            <tr key={booking.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                    {booking.id}
                                  </span>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(booking.id);
                                      setCopiedId(booking.id);
                                      setTimeout(() => setCopiedId(''), 1500);
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      cursor: 'pointer',
                                      color: copiedId === booking.id ? 'var(--success)' : 'var(--text-muted)',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      position: 'relative'
                                    }}
                                    title="Copy Full Booking ID"
                                  >
                                    {copiedId === booking.id ? (
                                      <span style={{ fontSize: '0.62rem', color: 'var(--success)', fontWeight: 'bold' }}>Copied!</span>
                                    ) : (
                                      <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                                {(() => {
                                  const passengerObj = users.find(u => (u.id === booking.passengerUserId || u._id === booking.passengerUserId)) || booking.passengerSnapshot;
                                  return passengerObj ? (
                                    <div style={{ marginTop: '4px' }}>
                                      {passengerObj.name && <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>{passengerObj.name}</div>}
                                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{passengerObj.mobile}</div>
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '4px' }}>{booking.passengerUserId || 'N/A'}</div>
                                  );
                                })()}
                              </td>
                              <td>
                                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{booking.packageTitle || 'Package Tour'}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code: {booking.packageCode || 'N/A'}</div>
                                <div style={{ marginTop: '6px' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    backgroundColor: 'var(--bg-main)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase'
                                  }}>
                                    {booking.vehicleType || 'Any'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.8rem' }}>
                                  📍 <strong>{booking.pickupPoint || 'N/A'}</strong>
                                </div>
                                {booking.destinations && booking.destinations.length > 0 && (
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '150px', whiteSpace: 'normal', lineHeight: 1.2 }}>
                                    To: {booking.destinations.join(' → ')}
                                  </div>
                                  )}
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                  📅 {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                </div>
                                <div style={{ marginTop: '6px' }}>
                                  <span className={`badge ${
                                    booking.status === 'ALLOCATED' || booking.isDriverAllocated || booking.status === 'TRAVEL_START' ? 'badge-success' :
                                    booking.status === 'CANCELLED' ? 'badge-error' : 'badge-warning'
                                  }`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                    {(booking.status === 'ALLOCATED' || booking.isDriverAllocated || booking.status === 'TRAVEL_START') && <Icons.Check />}
                                    {booking.status === 'REQUESTED' && <Icons.Clock />}
                                    {booking.status === 'CANCELLED' && <Icons.Cross />}
                                    {booking.status || 'REQUESTED'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.85rem' }}>₹{(booking.totalAmount ?? 0).toLocaleString()}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2, marginTop: '2px' }}>
                                    Adv: ₹{(booking.advanceAmount ?? 0).toLocaleString()}
                                    <br />
                                    Bal: ₹{(booking.balanceAmount ?? 0).toLocaleString()}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {booking.isDriverAllocated || booking.driver || booking.allocatedDriverUserId ? (
                                  (() => {
                                    const driverId = booking.allocatedDriverUserId || booking.driverId || (booking.driver && (typeof booking.driver === 'object' ? (booking.driver.id || booking.driver._id) : booking.driver));
                                    const driverObj = users.find(u => u.id === driverId || u._id === driverId) || booking.allocatedDriverSnapshot;
                                    const name = driverObj ? driverObj.name : (booking.allocatedDriverSnapshot ? booking.allocatedDriverSnapshot.name : 'Allocated');
                                    const mobile = driverObj ? driverObj.mobile : (booking.allocatedDriverSnapshot ? booking.allocatedDriverSnapshot.mobile : '');
                                    const vehicle = driverObj?.vehicle || booking.allocatedVehicleSnapshot || (booking.driver && typeof booking.driver === 'object' ? booking.driver.vehicle : null);

                                    return (
                                      <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>🧑‍✈️ {name}</div>
                                        {mobile && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{mobile}</div>}
                                        {vehicle && (
                                          <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-muted)',
                                            marginTop: '4px',
                                            padding: '2px 6px',
                                            backgroundColor: 'var(--bg-main)',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)',
                                            display: 'inline-block',
                                            lineHeight: '1.2'
                                          }}>
                                            🚗 {vehicle.make || ''} {vehicle.model || ''}
                                            <br />
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{vehicle.registrationNumber || ''}</span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not Allocated</span>
                                )}
                              </td>
                              <td>
                                {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') ? (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenAllocateModal(booking)}
                                    className={booking.isDriverAllocated || booking.status === 'ALLOCATED' || booking.status === 'TRAVEL_START' ? "btn btn-outline" : "btn btn-primary"}
                                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
                                  >
                                    {booking.isDriverAllocated || booking.status === 'ALLOCATED' || booking.status === 'TRAVEL_START' ? "Reallocate" : "Allocate"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {renderPagination(
                    packageBookingPage,
                    Math.ceil(packageBookings.length / packageBookingLimit),
                    packageBookingLimit,
                    packageBookings.length,
                    setPackageBookingPage,
                    (newLimit) => { setPackageBookingLimit(newLimit); setPackageBookingPage(1); },
                    false
                  )}
                </>
              )}
            </div>
          )}

          {/* LOCATIONS TAB */}
          {currentTab === 'locations' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3>Predefined Locations Management</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Add, edit, or disable preset locations. Drivers and passengers will select from this list when creating or searching rides.
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleOpenAddLocationModal}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                >
                  + Add Location
                </button>
              </div>

              {loadingLocations ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading predefined locations...</div>
              ) : locations.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                  No predefined locations are currently configured. Click "+ Add Location" to create one.
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Location Name</th>
                        <th>Latitude (Optional)</th>
                        <th>Longitude (Optional)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.map((loc) => (
                        <tr key={loc._id || loc.id}>
                          <td style={{ fontWeight: 700 }}>{loc.name}</td>
                          <td style={{ fontFamily: 'monospace' }}>
                            {loc.latitude !== undefined && loc.latitude !== null ? loc.latitude : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not specified</span>}
                          </td>
                          <td style={{ fontFamily: 'monospace' }}>
                            {loc.longitude !== undefined && loc.longitude !== null ? loc.longitude : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not specified</span>}
                          </td>
                          <td>
                            <span className={`badge ${loc.isActive ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                              {loc.isActive ? <Icons.Check /> : <Icons.Cross />}
                              {loc.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                className="btn btn-outline" 
                                onClick={() => handleOpenEditLocationModal(loc)}
                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                              >
                                Edit
                              </button>
                              <button 
                                className={`btn ${loc.isActive ? 'btn-danger' : 'btn-primary'}`}
                                onClick={() => handleToggleLocationStatus(loc)}
                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                              >
                                {loc.isActive ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* DOCUMENT REJECT MODAL */}
      {showDocRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Document</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                Please specify the reason why this document is being rejected. This notification will be sent to the driver.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Rejection</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="e.g. Image blurry, expiration date invalid, registration name mismatch..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDocRejectModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleRejectDocument}
                disabled={!rejectionReason.trim()}
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION REJECT MODAL */}
      {showAppRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Driver Application</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                Reject the entire application. The applicant will be notified of the reason.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Rejection</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="e.g. Multiple fraudulent documents, failed criminal background verification..."
                value={applicationRejectReason}
                onChange={(e) => setApplicationRejectReason(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAppRejectModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleRejectApplication}
                disabled={!applicationRejectReason.trim()}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALLOCATE PACKAGE BOOKING MODAL */}
      {showAllocateModal && selectedPackageBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Allocate Driver & Vehicle</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                Select an approved driver from the database to manually allocate to <strong>{selectedPackageBooking.packageTitle || selectedPackageBooking.packageName}</strong> (Booking ID: {selectedPackageBooking.id}).
              </p>
            </div>
            <form onSubmit={handleAllocateBooking}>
              <div className="form-group">
                <label className="form-label">Approved Driver</label>
                <select
                  className="form-control"
                  value={allocationDriverId}
                  onChange={(e) => setAllocationDriverId(e.target.value)}
                  required
                >
                  <option value="">-- Select Driver --</option>
                  {users
                    .filter(u => u.roles?.includes('DRIVER') && u.driverStatus === 'APPROVED' && u.vehicle && u.accountStatus === 'ACTIVE')
                    .map(driver => (
                      <option key={driver.id || driver._id} value={driver.id || driver._id}>
                        {driver.name} ({driver.mobile}) - {driver.vehicle.make || ''} {driver.vehicle.model || ''} ({driver.vehicle.registrationNumber || ''})
                      </option>
                    ))}
                </select>
              </div>

              {allocationDriverId && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem'
                }}>
                  {(() => {
                    const selectedDriver = users.find(u => (u.id === allocationDriverId || u._id === allocationDriverId));
                    if (!selectedDriver) return null;
                    if (!selectedDriver.vehicle) {
                      return <span style={{ color: 'var(--error)', fontWeight: 700 }}>⚠️ This driver does not have any registered vehicle. You cannot allocate this driver.</span>;
                    }
                    return (
                      <>
                        <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Allocated Vehicle Details</strong>
                        <div style={{ fontWeight: 700 }}>🚗 {selectedDriver.vehicle.make} {selectedDriver.vehicle.model} ({selectedDriver.vehicle.color})</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Registration No: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-main)' }}>{selectedDriver.vehicle.registrationNumber}</span> | Capacity: {selectedDriver.vehicle.seatCapacity} seats
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAllocateModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={
                    !allocationDriverId || 
                    !(() => {
                      const selectedDriver = users.find(u => (u.id === allocationDriverId || u._id === allocationDriverId));
                      return selectedDriver && selectedDriver.vehicle;
                    })()
                  }
                >
                  Allocate & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* LOCATION FORM MODAL */}
      {showLocationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedLocation ? 'Edit Predefined Location' : 'Add Predefined Location'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                Define a location name and optional coordinates. This name will appear in selection lists across the passenger and driver apps.
              </p>
            </div>
            <form onSubmit={handleSaveLocation}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Location Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Haridwar Bus Stand, Dehradun ISBT"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Latitude (Optional)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-control" 
                    placeholder="e.g. 29.9457"
                    value={locationLat}
                    onChange={(e) => setLocationLat(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Longitude (Optional)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-control" 
                    placeholder="e.g. 78.1642"
                    value={locationLng}
                    onChange={(e) => setLocationLng(e.target.value)}
                  />
                </div>
              </div>

              {locationModalError && (
                <div style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  ⚠️ {locationModalError}
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowLocationModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-secondary"
                  disabled={savingLocation}
                >
                  {savingLocation ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
