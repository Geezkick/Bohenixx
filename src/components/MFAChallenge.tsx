import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthScreen.module.css';

export default function MFAChallenge() {
  const { completeMfaChallenge, cancelMfaChallenge } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    const result = await completeMfaChallenge(code);
    if (!result.success) {
      setError(result.error || 'Failed to verify MFA code');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>Security Check</h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.45)', marginTop: '0.5rem' }}>
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Authentication Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className={styles.input}
            autoComplete="one-time-code"
            style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.5rem', fontFamily: 'monospace' }}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading || code.length !== 6}
        >
          {loading ? <span className={styles.spinner} /> : "Verify"}
        </button>

        <div className={styles.toggle}>
          <button
            className={styles.toggleBtn}
            onClick={cancelMfaChallenge}
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Cancel Login
          </button>
        </div>
      </div>
    </div>
  );
}
