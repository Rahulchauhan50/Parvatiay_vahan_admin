import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getAdminMe, runAdminTestAction, getStorageFileUrl, type AuthSession } from '../lib/api';
import { useAppDispatch } from '../store/hooks';
import { setNotice } from '../store/uiSlice';

interface OverviewSectionProps {
  session: AuthSession;
}

export function OverviewSection({ session }: OverviewSectionProps) {
  const dispatch = useAppDispatch();
  const [testAction, setTestAction] = useState({
    action: 'TEST_ACTION',
    targetType: 'SYSTEM',
    targetId: 'seed-target',
    source: 'admin-console',
  });

  const meQuery = useQuery({
    queryKey: ['admin-me'],
    queryFn: getAdminMe,
  });

  useEffect(() => {
    if (meQuery.data) {
      // keep a debug log outside of JSX to avoid returning void into the render tree
      // eslint-disable-next-line no-console
      console.log(meQuery.data);
    }
  }, [meQuery.data]);

  const testActionMutation = useMutation({
    mutationFn: () =>
      runAdminTestAction({
        action: testAction.action,
        targetType: testAction.targetType,
        targetId: testAction.targetId,
        metadata: { source: testAction.source },
      }),
    onSuccess: () => {
      dispatch(setNotice({ type: 'success', message: 'Audit action logged.' }));
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to log audit action' }));
    },
  });

  return (
    <section className="section-grid">
      <div className="panel section-card">
        <div className="section-header">
          <div>
            <h3>Admin Profile</h3>
            <p>Bootstrap data from <code>/admin/me</code>.</p>
          </div>
          <button className="btn secondary" onClick={() => meQuery.refetch()} disabled={meQuery.isFetching}>
            Reload
          </button>
        </div>
        <div className="grid-stats">
          <div className="stat">
            <div className="label">Profile</div>
            <div className="value" style={{ fontSize: '1rem' }}>
              {(() => {
                const admin = meQuery.data?.admin as any;
                const displayName = admin?.name || admin?.userName || admin?.mobile.slice(2) || session.user.mobile || session.user.id;
                const avatarPath = admin?.upload?.uploadUrl || admin?.avatar?.uploadUrl || admin?.photo?.uploadUrl || null;
                const avatarUrl = avatarPath ? getStorageFileUrl(avatarPath) : null;

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={String(displayName)} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(148,163,184,0.08)', display: 'grid', placeItems: 'center', color: 'var(--muted)', fontWeight: 700 }}>+91</div>
                    )}
                    <div>{displayName}</div>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="stat">
            <div className="label">Roles</div>
            <div className="value" style={{ fontSize: '1rem' }}>{session.user.roles.join(', ')}</div>
          </div>
          <div className="stat">
            <div className="label">Account</div>
            <div className="value" style={{ fontSize: '1rem' }}>{session.user.accountStatus}</div>
          </div>
          <div className="stat">
            <div className="label">Profile</div>
            <div className="value" style={{ fontSize: '1rem' }}>{session.user.profileCompleted ? 'Complete' : 'Incomplete'}</div>
          </div>
        </div>
      </div>

      <div className="panel section-card">
        <div className="section-header">
          <div>
            <h3>Admin Test Action</h3>
            <p>Writes a sample audit log entry.</p>
          </div>
        </div>
        <div className="field-grid">
          <label className="form-stack">
            <span className="small">Action</span>
            <input value={testAction.action} onChange={(event) => setTestAction({ ...testAction, action: event.target.value })} />
          </label>
          <label className="form-stack">
            <span className="small">Target Type</span>
            <input value={testAction.targetType} onChange={(event) => setTestAction({ ...testAction, targetType: event.target.value })} />
          </label>
          <label className="form-stack">
            <span className="small">Target ID</span>
            <input value={testAction.targetId} onChange={(event) => setTestAction({ ...testAction, targetId: event.target.value })} />
          </label>
        </div>
        <label className="form-stack" style={{ marginTop: 14 }}>
          <span className="small">Source</span>
          <input value={testAction.source} onChange={(event) => setTestAction({ ...testAction, source: event.target.value })} />
        </label>
        <div className="toolbar" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={() => testActionMutation.mutate()} disabled={testActionMutation.isPending}>
            {testActionMutation.isPending ? 'Saving...' : 'Log Action'}
          </button>
        </div>
      </div>
    </section>
  );
}
