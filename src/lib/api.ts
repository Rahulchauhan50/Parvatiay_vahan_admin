import { clearStoredSession, getStoredSession, saveStoredSession } from './storage';

export { clearStoredSession, getStoredSession, saveStoredSession } from './storage';

export type OtpPurpose = 'LOGIN' | 'SIGNUP';

export interface AuthUser {
  id: string;
  mobile: string;
  roles: string[];
  accountStatus: string;
  driverStatus: string;
  profileCompleted: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AdminMeResponse {
  admin: {
    userId: string;
    mobile: string;
    roles: string[];
    accountStatus: string;
    driverStatus: string;
    profileCompleted: boolean;
  };
}

export interface AdminRide {
  id: string;
  driverId: string;
  driverName?: string;
  vehicleId?: string;
  pickup?: { location?: string; city?: string };
  drop?: { location?: string; city?: string };
  status: string;
  departureAt: string;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  heldSeats: number;
  bookedSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBooking {
  id: string;
  passengerId: string;
  passengerName?: string;
  rideId: string;
  driverId: string;
  driverName?: string;
  status: string;
  seatsBooked: number;
  totalPrice: number;
  route: { pickup: string; drop: string };
  rideDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPayment {
  id: string;
  bookingId?: string;
  packageBookingId?: string;
  userId: string;
  userName?: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportSummary {
  period: { from: string; to: string };
  rides: { total: number; published: number; completed: number; cancelled: number };
  bookings: { total: number; confirmed: number; completed: number; cancelled: number };
  payments: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    totalAmount: number;
  };
  users: { totalPassengers: number; totalDrivers: number; newThisMonth: number };
  revenue: {
    totalCollected: number;
    totalByPaymentMethod: Record<string, number>;
    topRoutes: Array<{ route: string; amount: number; count: number }>;
  };
}

export interface PricingSettings {
  minPricePerSeat: number;
  maxPricePerSeat: number;
  basePricePerKm: number;
  peakHourMultiplier: number;
  peakHourStart: number;
  peakHourEnd: number;
  surgePricingEnabled: boolean;
  surgeThreshold: number;
  cancellationChargePercent: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface DriverApplicationUserSummary {
  id: string;
  name?: string;
  mobile: string;
  roles: string[];
}

export interface DriverApplicationSummary {
  id: string;
  userId: string;
  user: DriverApplicationUserSummary | null;
  status: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  notes?: string;
}

export interface DriverDocumentSummary {
  id: string;
  uploadId: string;
  documentType: string;
  status: string;
  mimeType: string;
  submittedAt: string;
  verifiedAt: string | null;
  rejectionReason?: string;
  upload: {
    originalFileName: string;
    privateUrl: string;
    uploadUrl: string;
    sizeBytes: number;
  } | null;
}

export interface DriverApplicationDetail {
  id: string;
  userId: string;
  user: DriverApplicationUserSummary | null;
  status: string;
  notes?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageBookingSummary {
  id: string;
  passengerUserId?: string;
  packageCode?: string;
  packageTitle?: string;
  pickupPoint?: string;
  travelDate?: string;
  vehicleType?: string;
  totalAmount?: number;
  advanceAmount?: number;
  balanceAmount?: number;
  status: string;
  isDriverAllocated?: boolean;
  driver?: unknown;
  allocatedDriverUserId?: string;
  allocatedVehicleId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AuditActionPayload {
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
}

const DEFAULT_API_BASE = 'https://api.parvatiyavahan.com';

export function getApiBaseUrl(): string {
  const value = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
    ?.VITE_API_BASE_URL;
  let baseUrl = (value?.trim() || DEFAULT_API_BASE).replace(/\/$/, '');



  return baseUrl;
}

/**
 * Transform a relative storage path into an absolute URL suitable for the current environment.
 * Handles both development (localhost with proxy) and production scenarios.
 *
 * @param storagePath - Relative storage path from backend, e.g., "/storage/taxi-backend/users/...file.jpg?expiresAt=..."
 * @returns Absolute URL that works in current environment
 */
export function getStorageFileUrl(storagePath: string): string {
  if (!storagePath) return '';

  const apiBase = getApiBaseUrl();
  const isLocalhost = apiBase.includes('localhost');

  if (isLocalhost) {
    // In development with localhost, use the proxy route
    // Remove leading /storage/ if present and use proxy path
    const cleanPath = storagePath.replace(/^\/storage\//, '');
    return `/api/storage/proxy-storage/${cleanPath}`;
  } else {
    // In production, use the full API base URL with the storage path
    return `${apiBase}${storagePath}`;
  }
}

function isEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return typeof payload === 'object' && payload !== null && 'success' in payload;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json();

  if (isEnvelope<T>(payload) && payload.success === false) {
    const message = payload.error?.message || payload.message || 'Request failed';
    throw new Error(message);
  }

  if (isEnvelope<T>(payload) && payload.data !== undefined) {
    return payload.data;
  }

  return payload as T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    const message =
      payload?.error?.message || payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return parseResponse<T>(response);
}

async function authedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getStoredSession();

  if (!session?.accessToken) {
    throw new Error('Please log in first');
  }

  const performRequest = async (accessToken: string): Promise<Response> => {
    return fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  };

  let response = await performRequest(session.accessToken);

  if (response.status === 401 && session.refreshToken) {
    const refreshed = await refreshAuth(session.refreshToken);
    saveStoredSession(refreshed);
    response = await performRequest(refreshed.accessToken);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    const message =
      payload?.error?.message || payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return parseResponse<T>(response);
}

export async function sendOtp(mobile: string, purpose: OtpPurpose = 'LOGIN') {
  return request<{
    mobile: string;
    purpose: OtpPurpose;
    expiresAt: string;
    resendAfterSeconds: number;
  }>('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ mobile, purpose }),
  });
}

export async function verifyOtp(mobile: string, otp: string, purpose: OtpPurpose = 'LOGIN') {
  const session = await request<AuthSession>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ mobile, otp, purpose }),
  });
  saveStoredSession(session);
  return session;
}

export async function refreshAuth(refreshToken: string) {
  const session = await request<AuthSession>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  saveStoredSession(session);
  return session;
}

export async function logoutAuth(refreshToken: string) {
  const result = await request<{ loggedOut: boolean }>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  clearStoredSession();
  return result;
}

export async function getAdminMe() {
  return authedRequest<AdminMeResponse>('/admin/me');
}

export async function runAdminTestAction(payload: AuditActionPayload) {
  return authedRequest<{ logged: boolean }>('/admin/test-action', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listAdminDriverApplications() {
  return authedRequest<{ applications: DriverApplicationSummary[] }>('/admin/driver-applications');
}

export async function getAdminDriverApplication(id: string) {
  return authedRequest<{
    application: DriverApplicationDetail;
    documents: DriverDocumentSummary[];
  }>(`/admin/driver-applications/${id}`);
}

export async function approveDriverApplication(id: string) {
  return authedRequest<Record<string, unknown>>(`/admin/driver-applications/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectDriverApplication(id: string, reason: string) {
  return authedRequest<Record<string, unknown>>(`/admin/driver-applications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function verifyDriverDocument(applicationId: string, documentId: string) {
  return authedRequest<Record<string, unknown>>(
    `/admin/driver-applications/${applicationId}/documents/${documentId}/verify`,
    {
      method: 'POST',
    },
  );
}

export async function rejectDriverDocument(
  applicationId: string,
  documentId: string,
  reason: string,
) {
  return authedRequest<Record<string, unknown>>(
    `/admin/driver-applications/${applicationId}/documents/${documentId}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
    },
  );
}

export async function listAdminRides(filters: {
  status?: string;
  route?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'departureAt' | 'pricePerSeat';
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  return authedRequest<{
    rides: AdminRide[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/admin/rides${params.toString() ? `?${params}` : ''}`);
}

export async function cancelRide(id: string, reason: string) {
  return authedRequest<Record<string, unknown>>(`/admin/rides/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function listAdminBookings(filters: {
  status?: string;
  routeKey?: string;
  driverId?: string;
  passengerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rideDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  return authedRequest<{
    bookings: AdminBooking[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/admin/bookings${params.toString() ? `?${params}` : ''}`);
}

export async function cancelBooking(id: string, reason: string) {
  return authedRequest<Record<string, unknown>>(`/admin/bookings/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function listAdminPayments(filters: {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  return authedRequest<{
    payments: AdminPayment[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/admin/payments${params.toString() ? `?${params}` : ''}`);
}

export async function getAdminReportSummary(daysBack: number = 30) {
  return authedRequest<{ summary: AdminReportSummary }>(
    `/admin/reports/summary?daysBack=${daysBack}`,
  );
}

export async function getPricingSettings() {
  return authedRequest<{ settings: PricingSettings }>('/admin/pricing/settings');
}

export async function updatePricingSettings(settings: Partial<PricingSettings>) {
  return authedRequest<{ settings: PricingSettings }>('/admin/pricing/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  });
}

export async function listPackageBookings() {
  return authedRequest<{ bookings: PackageBookingSummary[] }>('/admin/package-bookings');
}

export async function allocatePackageBooking(
  bookingId: string,
  data: { driverUserId: string; vehicleId: string; allocationNotes?: string },
) {
  return authedRequest<{ booking: PackageBookingSummary }>(
    `/admin/package-bookings/${bookingId}/allocate`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}
