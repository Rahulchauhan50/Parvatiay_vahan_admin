import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveDriverApplication,
  getAdminDriverApplication,
  getStorageFileUrl,
  listAdminDriverApplications,
  rejectDriverApplication,
  rejectDriverDocument,
  verifyDriverDocument,
  type DriverApplicationSummary,
} from '../lib/api';
import { formatDate } from '../lib/ui';
import { useAppDispatch } from '../store/hooks';
import { setNotice } from '../store/uiSlice';

export function DriverApplicationsSection() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Documents mismatch found');
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerMime, setViewerMime] = useState<string | null>(null);

  const applicationsQuery = useQuery({
    queryKey: ['driver-applications'],
    queryFn: listAdminDriverApplications,
  });

  const applicationDetailQuery = useQuery({
    queryKey: ['driver-application-detail', selectedApplicationId],
    queryFn: () => getAdminDriverApplication(selectedApplicationId as string),
    enabled: Boolean(selectedApplicationId),
  });

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['driver-applications'] }),
      selectedApplicationId
        ? queryClient.invalidateQueries({ queryKey: ['driver-application-detail', selectedApplicationId] })
        : Promise.resolve(),
    ]);
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveDriverApplication(id),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Driver application approved.' }));
      await refresh();
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to approve application' }));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectDriverApplication(id, reason),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Driver application rejected.' }));
      await refresh();
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to reject application' }));
    },
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ applicationId, documentId }: { applicationId: string; documentId: string }) =>
      verifyDriverDocument(applicationId, documentId),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Document verified.' }));
      await refresh();
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to verify document' }));
    },
  });

  const rejectDocumentMutation = useMutation({
    mutationFn: ({ applicationId, documentId, reason }: { applicationId: string; documentId: string; reason: string }) =>
      rejectDriverDocument(applicationId, documentId, reason),
    onSuccess: async () => {
      dispatch(setNotice({ type: 'success', message: 'Document rejected.' }));
      await refresh();
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to reject document' }));
    },
  });

  const applications = applicationsQuery.data?.applications || [];
  const selectedApplication = applicationDetailQuery.data?.application as DriverApplicationSummary | undefined;
  const selectedDocuments = applicationDetailQuery.data?.documents || [];

  return (
    <section className="panel section-card">
      <div className="section-header">
        <div>
          <h3>Driver Applications</h3>
          <p>Review, approve, and reject driver onboarding requests.</p>
        </div>
        <button className="btn secondary" onClick={() => applicationsQuery.refetch()} disabled={applicationsQuery.isFetching}>
          Refresh
        </button>
      </div>

      <div className="mini-grid">
        {applications.map((application) => (
          <div className="row-card" key={application.id}>
            <div className="row-top">
              <div>
                <div className="row-title">{application.user?.name || application.userId || application.id}</div>
                <div className="row-meta">
                  Status: <strong>{application.status}</strong><br />
                  Mobile: {application.user?.mobile || '—'}<br />
                  Created: {formatDate(application.createdAt)}
                </div>
              </div>
              <span className="badge">{application.documentCount ?? 0} docs</span>
            </div>
            <div className="toolbar" style={{ marginTop: 12 }}>
              <button className="btn secondary" onClick={() => setSelectedApplicationId(application.id)}>
                Detail
              </button>
              <button className="btn primary" onClick={() => approveMutation.mutate(application.id)}>
                Approve
              </button>
            </div>
            <label className="form-stack" style={{ marginTop: 12 }}>
              <span className="small">Reject reason</span>
              <input value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
            </label>
            <div className="toolbar" style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => rejectMutation.mutate({ id: application.id, reason: rejectReason })}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedApplication ? (
        <div className="row-card" style={{ marginTop: 16 }}>
          <div className="row-top">
            <div>
              <div className="row-title">Application: {selectedApplication.id}</div>
              <div className="row-meta">
                Driver: {selectedApplication.user?.name || selectedApplication.userId}<br />
                Mobile: {selectedApplication.user?.mobile || '—'}<br />
                Status: <strong>{selectedApplication.status}</strong><br />
                Created: {formatDate(selectedApplication.createdAt)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Uploaded Documents</div>
            {selectedDocuments.length === 0 ? (
              <div className="muted">No documents uploaded.</div>
            ) : (
              selectedDocuments.map((doc) => (
                <div key={doc.id} className="row-card" style={{ marginBottom: 8 }}>
                  <div className="row-top">
                    <div>
                      <div className="row-title">{doc.upload?.originalFileName || doc.documentType}</div>
                      <div className="row-meta">
                        Type: {doc.documentType} • Status: <strong>{doc.status}</strong><br />
                        Submitted: {formatDate(doc.submittedAt)} • MIME: {doc.mimeType}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {doc.upload?.uploadUrl ? (
                        <a
                          href={getStorageFileUrl(doc.upload.uploadUrl)}
                          
                        target='_black'
                          className="btn ghost"
                          // onClick={() => {
                          //   const rawUrl = doc.upload?.privateUrl || doc.upload?.uploadUrl;
                          //   if (!rawUrl) return;
                          //   const url = getStorageFileUrl(rawUrl);
                          //   if (doc.mimeType?.startsWith('image/')) {
                          //     setViewerUrl(url);
                          //     setViewerMime(doc.mimeType);
                          //   } else {
                          //     window.open(url, '_blank');
                          //   }
                          // }}
                        >
                          View
                        </a>
                      ) : null}
                      {doc.status !== 'VERIFIED' ? (
                        <button
                          className="btn primary"
                          style={{ marginLeft: 8 }}
                          onClick={() => verifyDocumentMutation.mutate({ applicationId: selectedApplication.id, documentId: doc.id })}
                        >
                          Verify
                        </button>
                      ) : null}
                      <button
                        className="btn ghost"
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          const reason = window.prompt('Enter rejection reason for this document', 'Incorrect or unreadable document');
                          if (!reason) return;
                          rejectDocumentMutation.mutate({
                            applicationId: selectedApplication.id,
                            documentId: doc.id,
                            reason,
                          });
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {viewerUrl ? (
        <div className="modal-backdrop" onClick={() => { setViewerUrl(null); setViewerMime(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn ghost" onClick={() => { setViewerUrl(null); setViewerMime(null); }}>Close</button>
            </div>
            {viewerMime && viewerMime.startsWith('image/') ? (
              <img src={viewerUrl} alt="doc" style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block', margin: '0 auto' }} />
            ) : (
              <iframe src={viewerUrl} style={{ width: '100%', height: '70vh', border: 'none' }} title="doc-viewer" />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
