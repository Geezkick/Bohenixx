"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: '#05020a',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Redirecting...</h1>
      <p>You're being redirected to the home page.</p>
    </div>
  );
}
