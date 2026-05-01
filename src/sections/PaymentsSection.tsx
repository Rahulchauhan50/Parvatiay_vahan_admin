import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { listAdminPayments } from '../lib/api';
import { formatDate, initialQuery, money } from '../lib/ui';

export function PaymentsSection() {
  const [paymentFilters, setPaymentFilters] = useState(
    initialQuery({
      status: '', type: '', driverId: '', passengerId: '', dateFrom: '', dateTo: '', page: '1', limit: '10', sortBy: 'createdAt', sortOrder: 'desc',
    }),
  );

  const paymentsQuery = useQuery({
    queryKey: ['admin-payments', paymentFilters],
    queryFn: () =>
      listAdminPayments({
        status: paymentFilters.status,
        type: paymentFilters.type,
        driverId: paymentFilters.driverId,
        passengerId: paymentFilters.passengerId,
        dateFrom: paymentFilters.dateFrom,
        dateTo: paymentFilters.dateTo,
        page: Number(paymentFilters.page || 1),
        limit: Number(paymentFilters.limit || 10),
        sortBy: paymentFilters.sortBy as 'createdAt' | 'amount' | 'status',
        sortOrder: paymentFilters.sortOrder as 'asc' | 'desc',
      }),
    enabled: false,
  });

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Payments</h3>
          <p>Review payment capture and status details.</p>
        </div>
        <button className="btn secondary" onClick={() => paymentsQuery.refetch()} disabled={paymentsQuery.isFetching}>
          Load
        </button>
      </div>
      <div className="field-grid">
        {(['status', 'type', 'driverId', 'passengerId', 'dateFrom', 'dateTo', 'page', 'limit'] as const).map((field) => (
          <label className="form-stack" key={field}>
            <span className="small">{field}</span>
            <input
              value={paymentFilters[field]}
              onChange={(event) => setPaymentFilters({ ...paymentFilters, [field]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="table-list scroll-area" style={{ marginTop: 16 }}>
        {(paymentsQuery.data?.payments || []).map((payment) => (
          <div className="row-card" key={payment.id}>
            <div className="row-top">
              <div>
                <div className="row-title">{payment.type}</div>
                <div className="row-meta">
                  User: {payment.userName || payment.userId}<br />
                  Transaction: {payment.transactionId || '—'}<br />
                  Created: {formatDate(payment.createdAt)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge success">{payment.status}</div>
                <div className="small" style={{ marginTop: 8 }}>{money(payment.amount)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
