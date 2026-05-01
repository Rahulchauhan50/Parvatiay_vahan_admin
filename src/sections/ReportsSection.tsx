import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAdminReportSummary } from '../lib/api';
import { money } from '../lib/ui';

export function ReportsSection() {
  const [daysBack, setDaysBack] = useState(30);

  const reportQuery = useQuery({
    queryKey: ['admin-report', daysBack],
    queryFn: () => getAdminReportSummary(daysBack),
    enabled: false,
  });

  const reportSummary = reportQuery.data?.summary;

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Reports</h3>
          <p>Aggregated ride, booking, payment, and revenue metrics.</p>
        </div>
        <div className="toolbar">
          <label className="form-stack" style={{ minWidth: 180 }}>
            <span className="small">Days Back</span>
            <input type="number" value={daysBack} onChange={(event) => setDaysBack(Number(event.target.value))} />
          </label>
          <button className="btn primary" onClick={() => reportQuery.refetch()} disabled={reportQuery.isFetching}>
            Generate
          </button>
        </div>
      </div>

      {reportSummary ? (
        <div className="section-grid">
          <div className="grid-stats">
            <div className="stat"><div className="label">Rides</div><div className="value">{reportSummary.rides.total}</div></div>
            <div className="stat"><div className="label">Bookings</div><div className="value">{reportSummary.bookings.total}</div></div>
            <div className="stat"><div className="label">Payments</div><div className="value">{reportSummary.payments.total}</div></div>
            <div className="stat"><div className="label">Collected</div><div className="value">{money(reportSummary.revenue.totalCollected)}</div></div>
          </div>

          <div className="mini-grid">
            <div className="row-card">
              <div className="row-title">Ride Split</div>
              <div className="row-meta">
                Published: {reportSummary.rides.published}<br />
                Completed: {reportSummary.rides.completed}<br />
                Cancelled: {reportSummary.rides.cancelled}
              </div>
            </div>
            <div className="row-card">
              <div className="row-title">Booking Split</div>
              <div className="row-meta">
                Confirmed: {reportSummary.bookings.confirmed}<br />
                Completed: {reportSummary.bookings.completed}<br />
                Cancelled: {reportSummary.bookings.cancelled}
              </div>
            </div>
            <div className="row-card">
              <div className="row-title">Payments Split</div>
              <div className="row-meta">
                Successful: {reportSummary.payments.successful}<br />
                Failed: {reportSummary.payments.failed}<br />
                Pending: {reportSummary.payments.pending}
              </div>
            </div>
          </div>

          <div className="row-card">
            <div className="row-title">Top Routes</div>
            <div className="mini-grid" style={{ marginTop: 10 }}>
              {reportSummary.revenue.topRoutes.map((route) => (
                <div className="stat" key={route.route}>
                  <div className="label">{route.route}</div>
                  <div className="value">{money(route.amount)}</div>
                  <div className="small">{route.count} bookings</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
