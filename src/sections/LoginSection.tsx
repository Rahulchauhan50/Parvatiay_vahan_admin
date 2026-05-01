import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { sendOtp, verifyOtp } from '../lib/api';
import { useAppDispatch } from '../store/hooks';
import { setSession } from '../store/authSlice';
import { setNotice } from '../store/uiSlice';

export function LoginSection() {
  const dispatch = useAppDispatch();
  const [mobile, setMobile] = useState('');
  const [purpose, setPurpose] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [securityCode, setSecurityCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const isSecurityCodeValid = securityCode === 'FWD#FRB65';
  const normalizedMobile = mobile.trim();
  const apiMobile = `91${normalizedMobile}`;
  const isMobileValid = /^\d{10}$/.test(normalizedMobile);

  const onMobileChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setMobile(digitsOnly.slice(0, 10));
  };

  const sendOtpMutation = useMutation({
    mutationFn: () => sendOtp(apiMobile, purpose),
    onSuccess: () => {
      setOtpRequested(true);
      dispatch(setNotice({ type: 'success', message: 'OTP sent successfully.' }));
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send OTP' }));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => verifyOtp(apiMobile, otp.trim(), purpose),
    onSuccess: (session) => {
      dispatch(setSession(session));
      setOtpRequested(false);
      setOtp('');
      dispatch(setNotice({ type: 'success', message: 'Logged in successfully.' }));
    },
    onError: (error) => {
      dispatch(setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to verify OTP' }));
    },
  });

  const busy = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="login-grid">
      <div className="panel login-card">
        <div className="login-visual">
          <span className="chip">Taxi Admin Panel</span>
          <h2>Admin console for operations, reports, and package allocation.</h2>
          <p>
            Sign in with the same OTP auth flow as the backend. After login, the panel exposes
            the admin-only routes for rides, bookings, payments, reports, pricing, driver approvals,
            and special package allocation.
          </p>
          <div className="login-bullets">
            <div>OTP login and refresh-token session handling</div>
            <div>Admin operations, reports, and pricing controls</div>
            <div>Driver approvals and package allocations</div>
          </div>
        </div>
        <div className="login-form">
          <div className="section-header">
            <div>
              <h3>Admin Sign In</h3>
              <p>Use an approved admin phone number.</p>
            </div>
            <span className="badge">OTP</span>
          </div>

          <div className="form-stack">
            <label className="form-stack">
              <span className="small">Security Code</span>
              <input
                value={securityCode}
                onChange={(event) => setSecurityCode(event.target.value)}
                placeholder="Enter security code"
                autoComplete="off"
              />
            </label>

            <label className="form-stack">
              <span className="small">Mobile</span>
              <div className="mobile-input-row">
                <input value="+91" disabled aria-label="Country code" style={{ maxWidth: 72 }} />
                <input
                  value={mobile}
                  onChange={(event) => onMobileChange(event.target.value)}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  disabled={!isSecurityCodeValid}
                />
              </div>
            </label>

            <div className="form-row">
              <label className="form-stack">
                <span className="small">Purpose</span>
                <select
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value as 'LOGIN' | 'SIGNUP')}
                  disabled={!isSecurityCodeValid}
                >
                  <option value="LOGIN">LOGIN</option>
                  <option value="SIGNUP">SIGNUP</option>
                </select>
              </label>
              <label className="form-stack">
                <span className="small">OTP</span>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  disabled={!isSecurityCodeValid}
                />
              </label>
            </div>

            <div className={`badge ${isSecurityCodeValid ? 'success' : ''}`}>
              {isSecurityCodeValid ? 'Security code accepted' : 'Security code required'}
            </div>

            <div className="toolbar">
              <button
                className="btn primary"
                onClick={() => sendOtpMutation.mutate()}
                disabled={busy || !isSecurityCodeValid || !isMobileValid}
              >
                {sendOtpMutation.isPending ? 'Sending...' : otpRequested ? 'Resend OTP' : 'Send OTP'}
              </button>
              <button
                className="btn secondary"
                onClick={() => verifyOtpMutation.mutate()}
                disabled={busy || !isSecurityCodeValid || !isMobileValid}
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
