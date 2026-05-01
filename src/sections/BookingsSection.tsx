import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { listAdminBookings } from '../lib/api';
import { formatDate, initialQuery, money } from '../lib/ui';

export function BookingsSection() {
  const [bookingFilters, setBookingFilters] = useState(
    initialQuery({
      status: '', routeKey: '', driverId: '', passengerId: '', dateFrom: '', dateTo: '', page: '1', limit: '10', sortBy: 'createdAt', sortOrder: 'desc',
    }),
  );

  const bookingsQuery = useQuery({
    queryKey: ['admin-bookings', bookingFilters],
    queryFn: () =>
      listAdminBookings({
        status: bookingFilters.status,
        routeKey: bookingFilters.routeKey,
        driverId: bookingFilters.driverId,
        passengerId: bookingFilters.passengerId,
        dateFrom: bookingFilters.dateFrom,
        dateTo: bookingFilters.dateTo,
        page: Number(bookingFilters.page || 1),
        limit: Number(bookingFilters.limit || 10),
        sortBy: bookingFilters.sortBy as 'createdAt' | 'rideDate' | 'totalPrice',
        sortOrder: bookingFilters.sortOrder as 'asc' | 'desc',
      }),
    enabled: false,
  });

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Bookings</h3>
          <p>Inspect all seat bookings across statuses.</p>
        </div>
        <button className="btn secondary" onClick={() => bookingsQuery.refetch()} disabled={bookingsQuery.isFetching}>
          Load
        </button>
      </div>
      <div className="field-grid">
        {(['status', 'routeKey', 'driverId', 'passengerId', 'dateFrom', 'dateTo', 'page', 'limit'] as const).map((field) => (
          <label className="form-stack" key={field}>
            <span className="small">{field}</span>
            <input
              value={bookingFilters[field]}
              onChange={(event) => setBookingFilters({ ...bookingFilters, [field]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="table-list scroll-area" style={{ marginTop: 16 }}>
        {(bookingsQuery.data?.bookings || []).map((booking) => (
          <div className="row-card" key={booking.id}>
            <div className="row-top">
              <div>
                <div className="row-title">{booking.route.pickup} → {booking.route.drop}</div>
                <div className="row-meta">
                  Passenger: {booking.passengerName || booking.passengerId}<br />
                  Driver: {booking.driverName || booking.driverId}<br />
                  Ride date: {formatDate(booking.rideDate)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge">{booking.status}</div>
                <div className="small" style={{ marginTop: 8 }}>{money(booking.totalPrice)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
