import type { PricingSettings } from './api';

export const tabs = [
  'overview',
  'driver-applications',
  'rides',
  'bookings',
  'payments',
  'reports',
  'pricing',
  'packages',
] as const;

export type TabKey = (typeof tabs)[number];

export const defaultPricing: PricingSettings = {
  minPricePerSeat: 100,
  maxPricePerSeat: 5000,
  basePricePerKm: 15,
  peakHourMultiplier: 1.5,
  peakHourStart: 8,
  peakHourEnd: 11,
  surgePricingEnabled: false,
  surgeThreshold: 80,
  cancellationChargePercent: 10,
};

export function money(value?: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function initialQuery<T extends Record<string, string>>(query: T): T {
  return query;
}
