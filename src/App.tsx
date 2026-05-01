import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { logoutAuth, refreshAuth } from './lib/api';
import { tabs, type TabKey } from './lib/ui';
import { NoticeBanner } from './components/NoticeBanner';
import { BookingsSection } from './sections/BookingsSection';
import { DriverApplicationsSection } from './sections/DriverApplicationsSection';
import { LoginSection } from './sections/LoginSection';
import { OverviewSection } from './sections/OverviewSection';
import { PackagesSection } from './sections/PackagesSection';
import { PaymentsSection } from './sections/PaymentsSection';
import { PricingSection } from './sections/PricingSection';
import { ReportsSection } from './sections/ReportsSection';
import { RidesSection } from './sections/RidesSection';
import { clearSession, setSession } from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setActiveTab, setNotice } from './store/uiSlice';

function App() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const notice = useAppSelector((state) => state.ui.notice);

  const refreshMutation = useMutation({
    mutationFn: () => refreshAuth(session!.refreshToken),
    onSuccess: (nextSession) => {
      dispatch(setSession(nextSession));
      dispatch(setNotice({ type: 'success', message: 'Session refreshed.' }));
    },
    onError: (error) => {
      dispatch(clearSession());
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Session refresh failed' }));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutAuth(session!.refreshToken),
    onSuccess: () => {
      dispatch(clearSession());
      dispatch(setNotice({ type: 'success', message: 'Logged out.' }));
    },
    onError: () => {
      dispatch(clearSession());
      dispatch(setNotice({ type: 'success', message: 'Logged out.' }));
    },
  });

  const sessionRoleLabel = useMemo(() => session?.user.roles.join(', ') || 'Not logged in', [session]);

  if (!session) {
    return <LoginSection />;
  }

  const renderSection = (tab: TabKey) => {
    if (tab === 'overview') return <OverviewSection session={session} />;
    if (tab === 'driver-applications') return <DriverApplicationsSection />;
    if (tab === 'rides') return <RidesSection />;
    if (tab === 'bookings') return <BookingsSection />;
    if (tab === 'payments') return <PaymentsSection />;
    if (tab === 'reports') return <ReportsSection />;
    if (tab === 'pricing') return <PricingSection />;
    if (tab === 'packages') return <PackagesSection />;
    return null;
  };

  return (
    <div className="app-shell">
      <div className="shell-grid">
        <aside className="panel panel-inner">
          <div className="brand">
            <div className="brand-mark">TA</div>
            <div>
              <h1>Taxi Admin</h1>
              <p>{sessionRoleLabel}</p>
            </div>
          </div>

          <div className="small">Logged in as</div>
          <div style={{ marginTop: 8, marginBottom: 14 }}>
            <div style={{ fontWeight: 800 }}>{session.user.mobile}</div>
            <div className="small">{session.user.roles.join(' · ')}</div>
          </div>

          <div className="nav-list">
            {tabs.map((tab) => (
              <button key={tab} className={`nav-button ${activeTab === tab ? 'active' : ''}`} onClick={() => dispatch(setActiveTab(tab))}>
                {tab
                  .split('-')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')}
              </button>
            ))}
          </div>

          <div className="toolbar" style={{ marginTop: 18 }}>
            <button className="btn secondary" onClick={() => refreshMutation.mutate()} disabled={refreshMutation.isPending || logoutMutation.isPending}>
              {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Session'}
            </button>
            <button className="btn ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending || refreshMutation.isPending}>
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </aside>

        <main className="main-column">
          <section className="panel hero panel-inner">
            <div>
              <span className="chip">Operational Admin Console</span>
              <h2>Manage rides, bookings, payments, reports, approvals, pricing, and package allocations.</h2>
              <p>
                The panel speaks directly to the backend routes under /admin and the OTP auth endpoints.
              </p>
            </div>
            <div className="hero-actions">
              <span className="badge success">Authenticated</span>
              <span className="badge">{session.user.accountStatus}</span>
              <span className="badge">{session.user.driverStatus}</span>
            </div>
          </section>

          <NoticeBanner notice={notice} />
          {renderSection(activeTab)}
        </main>
      </div>
    </div>
  );
}

export default App;
