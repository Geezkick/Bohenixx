import React from 'react';

export default function MFAEnrollment({ onComplete }: { onComplete?: () => void }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Two-Factor Authentication</h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.5 }}>
        2FA via authenticator app is coming soon. Your account is protected by Google OAuth or a secure password.
      </p>
    </div>
  );
}
