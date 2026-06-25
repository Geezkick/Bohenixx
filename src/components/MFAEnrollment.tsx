import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './AuthScreen.module.css';

export default function MFAEnrollment({ onComplete }: { onComplete?: () => void }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleEnroll = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.totp.qr_code) {
      setQrCode(data.totp.qr_code);
      setFactorId(data.id);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!factorId || code.length !== 6) return;
    setLoading(true);
    setError('');

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      setError(challengeError.message);
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    if (onComplete) onComplete();
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
        <h3 style={{ color: '#00E5FF', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>✓ 2FA Enabled</h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Your account is now secured with two-factor authentication.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', maxWidth: '420px', margin: '0 auto' }}>
      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Two-Factor Authentication</h3>
      
      {!qrCode ? (
        <>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Add an extra layer of security to your account. You will need an authenticator app like Google Authenticator or Authy to scan the QR code.
          </p>
          <button 
            onClick={handleEnroll} 
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? <span className={styles.spinner} /> : "Set up 2FA"}
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1rem', textAlign: 'center' }}>
            Scan this QR code with your authenticator app:
          </p>
          
          <div 
            style={{ background: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />

          <div style={{ width: '100%' }} className={styles.inputGroup}>
            <label className={styles.label} style={{ marginBottom: '0.5rem' }}>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className={styles.input}
              style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'monospace' }}
            />
          </div>

          {error && <p className={styles.error} style={{ width: '100%', marginTop: '1rem' }}>{error}</p>}

          <button 
            onClick={handleVerify} 
            disabled={loading || code.length !== 6}
            className={styles.submitBtn}
            style={{ marginTop: '1.5rem', width: '100%' }}
          >
            {loading ? <span className={styles.spinner} /> : "Verify and Enable"}
          </button>
        </div>
      )}
    </div>
  );
}
