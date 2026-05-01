import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { cancelRide, listAdminRides } from '../lib/api';
import { formatDate, initialQuery } from '../lib/ui';
import { useAppDispatch } from '../store/hooks';
import { setNotice } from '../store/uiSlice';

export function RidesSection() {
  const dispatch = useAppDispatch();
  const [rideFilters, setRideFilters] = useState(
    initialQuery({
      status: '', route: '', driverId: '', dateFrom: '', dateTo: '', page: '1', limit: '10', sortBy: 'createdAt', sortOrder: 'desc',
    }),
  );
  const [cancelRideForm, setCancelRideForm] = useState({ rideId: '', reason: '' });

  const ridesQuery = useQuery({
    queryKey: ['admin-rides', rideFilters],
    queryFn: () =>
      listAdminRides({
        status: rideFilters.status,
        route: rideFilters.route,
        driverId: rideFilters.driverId,
        dateFrom: rideFilters.dateFrom,
        dateTo: rideFilters.dateTo,
        page: Number(rideFilters.page || 1),
        limit: Number(rideFilters.limit || 10),
        sortBy: rideFilters.sortBy as 'createdAt' | 'departureAt' | 'pricePerSeat',
        sortOrder: rideFilters.sortOrder as 'asc' | 'desc',
      }),
    enabled: false,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ rideId, reason }: { rideId: string; reason: string }) => cancelRide(rideId, reason),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Ride cancellation requested/processed.' }));
      setCancelRideForm({ rideId: '', reason: '' });
      await ridesQuery.refetch();
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to cancel ride' }));
    },
  });

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Rides</h3>
          <p>Filter rides and approve admin ride cancellations.</p>
        </div>
        <button className="btn secondary" onClick={() => ridesQuery.refetch()} disabled={ridesQuery.isFetching}>
          Load
        </button>
      </div>
      <div className="field-grid">
        {(['status', 'route', 'driverId', 'dateFrom', 'dateTo', 'page', 'limit'] as const).map((field) => (
          <label className="form-stack" key={field}>
            <span className="small">{field}</span>
            <input
              value={rideFilters[field]}
              onChange={(event) => setRideFilters({ ...rideFilters, [field]: event.target.value })}
              placeholder={field}
            />
          </label>
        ))}
      </div>
      <div className="field-grid" style={{ marginTop: 14 }}>
        <label className="form-stack">
          <span className="small">Sort By</span>
          <select value={rideFilters.sortBy} onChange={(event) => setRideFilters({ ...rideFilters, sortBy: event.target.value })}>
            <option value="createdAt">createdAt</option>
            <option value="departureAt">departureAt</option>
            <option value="pricePerSeat">pricePerSeat</option>
          </select>
        </label>
        <label className="form-stack">
          <span className="small">Sort Order</span>
          <select value={rideFilters.sortOrder} onChange={(event) => setRideFilters({ ...rideFilters, sortOrder: event.target.value })}>
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </label>
      </div>
      <div className="table-list scroll-area" style={{ marginTop: 16 }}>
        {(ridesQuery.data?.rides || []).map((ride) => (
          <div className="row-card" key={ride.id}>
            <div className="row-top">
              <div>
                <div className="row-title">
                  {(ride.pickup?.location || ride.pickup?.city || 'Pickup') + ' → ' + (ride.drop?.location || ride.drop?.city || 'Drop')}
                </div>
                <div className="row-meta">
                  Driver: {ride.driverName || ride.driverId}<br />
                  Departure: {formatDate(ride.departureAt)}<br />
                  Seats: {ride.availableSeats}/{ride.totalSeats} available
                </div>
              </div>
              <span className="badge success">{ride.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="toolbar" style={{ marginTop: 16 }}>
        <label className="form-stack" style={{ minWidth: 220 }}>
          <span className="small">Ride ID to cancel</span>
          <input value={cancelRideForm.rideId} onChange={(event) => setCancelRideForm({ ...cancelRideForm, rideId: event.target.value })} />
        </label>
        <label className="form-stack" style={{ flex: 1, minWidth: 260 }}>
          <span className="small">Reason</span>
          <input value={cancelRideForm.reason} onChange={(event) => setCancelRideForm({ ...cancelRideForm, reason: event.target.value })} />
        </label>
        <button
          className="btn primary"
          onClick={() => {
            if (!cancelRideForm.rideId || !cancelRideForm.reason) {
              dispatch(setNotice({ type: 'error', message: 'Ride ID and reason are required.' }));
              return;
            }
            cancelMutation.mutate({ rideId: cancelRideForm.rideId.trim(), reason: cancelRideForm.reason.trim() });
          }}
          disabled={cancelMutation.isPending}
        >
          Cancel Ride
        </button>
      </div>
    </section>
  );
}
