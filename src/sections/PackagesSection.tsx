import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { allocatePackageBooking, listPackageBookings } from '../lib/api';
import { formatDate } from '../lib/ui';
import { useAppDispatch } from '../store/hooks';
import { setNotice } from '../store/uiSlice';

export function PackagesSection() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [packageAllocation, setPackageAllocation] = useState({ id: '', driverUserId: '', vehicleId: '', allocationNotes: '' });

  const packagesQuery = useQuery({
    queryKey: ['package-bookings'],
    queryFn: listPackageBookings,
  });

  const allocateMutation = useMutation({
    mutationFn: () =>
      allocatePackageBooking(packageAllocation.id.trim(), {
        driverUserId: packageAllocation.driverUserId.trim(),
        vehicleId: packageAllocation.vehicleId.trim(),
        allocationNotes: packageAllocation.allocationNotes.trim() || undefined,
      }),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Package booking allocated.' }));
      setPackageAllocation({ id: '', driverUserId: '', vehicleId: '', allocationNotes: '' });
      await queryClient.invalidateQueries({ queryKey: ['package-bookings'] });
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to allocate package booking' }));
    },
  });

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Package Bookings</h3>
          <p>Allocate driver and vehicle after payment confirmation.</p>
        </div>
        <button className="btn secondary" onClick={() => packagesQuery.refetch()} disabled={packagesQuery.isFetching}>
          Refresh
        </button>
      </div>

      <div className="mini-grid">
        {(packagesQuery.data?.bookings || []).map((booking) => (
          <div className="row-card" key={booking.id}>
            <div className="row-top">
              <div>
                <div className="row-title">{booking.packageTitle || booking.packageCode}</div>
                <div className="row-meta">
                  Status: {booking.status}<br />
                  Pickup: {booking.pickupPoint || '—'}<br />
                  Travel: {formatDate(booking.travelDate)}
                </div>
              </div>
              <span className="badge">{booking.isDriverAllocated ? 'Allocated' : 'Pending'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="field-grid" style={{ marginTop: 16 }}>
        <label className="form-stack"><span className="small">Booking ID</span><input value={packageAllocation.id} onChange={(event) => setPackageAllocation({ ...packageAllocation, id: event.target.value })} /></label>
        <label className="form-stack"><span className="small">Driver User ID</span><input value={packageAllocation.driverUserId} onChange={(event) => setPackageAllocation({ ...packageAllocation, driverUserId: event.target.value })} /></label>
        <label className="form-stack"><span className="small">Vehicle ID</span><input value={packageAllocation.vehicleId} onChange={(event) => setPackageAllocation({ ...packageAllocation, vehicleId: event.target.value })} /></label>
      </div>
      <label className="form-stack" style={{ marginTop: 14 }}>
        <span className="small">Allocation Notes</span>
        <textarea value={packageAllocation.allocationNotes} onChange={(event) => setPackageAllocation({ ...packageAllocation, allocationNotes: event.target.value })} />
      </label>
      <div className="toolbar" style={{ marginTop: 14 }}>
        <button
          className="btn primary"
          onClick={() => {
            if (!packageAllocation.id || !packageAllocation.driverUserId || !packageAllocation.vehicleId) {
              dispatch(setNotice({ type: 'error', message: 'Booking ID, driver ID, and vehicle ID are required.' }));
              return;
            }
            allocateMutation.mutate();
          }}
          disabled={allocateMutation.isPending}
        >
          Allocate Booking
        </button>
      </div>
    </section>
  );
}
