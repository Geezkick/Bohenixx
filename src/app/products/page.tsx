"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftIcon, ArrowRightIcon, Sprout, ScanLine } from 'lucide-react';
import React from 'react';

const ecosystem: any[] = [];

export default function ProductsPage() {
  // Since we require auth via middleware for /products, we assume the user is signed in here.
  // But we still wrap the link just in case.
  const { user } = useAuth();

  return (
    <>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      <main style={{ padding: '6rem 2rem 2rem', minHeight: '100vh', background: '#050505' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Our Ecosystem</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore the cutting-edge enterprise platforms powered by Bohenix ONE.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Flagship Flow AI Card */}
            <div 
                style={{
                  background: 'linear-gradient(180deg, rgba(123,45,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                  border: '1px solid rgba(123,45,255,0.3)',
                  borderRadius: '24px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                    <Image src="/bohenixx.png" alt="Bohenix Flow AI" width={60} height={60} style={{ objectFit: 'cover' }} />
                  </div>
                  
                  <span style={{ background: '#7B2DFF', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    FLAGSHIP
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Bohenix Flow AI</h3>
                <p style={{ color: '#E0E0E0', lineHeight: 1.5, margin: 0, flex: 1, fontSize: '0.95rem' }}>An AI-first SaaS platform that enables businesses to delegate complete workflows to autonomous AI agents. Your business on autopilot.</p>
                
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    Free Trial
                  </span>
                  
                  <Link 
                    href="/flow-ai" 
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#fff', 
                      color: '#000', 
                      border: 'none', 
                      padding: '0.6rem 1.25rem', 
                      borderRadius: '99px', 
                      fontWeight: 600, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    Open App <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>

            {ecosystem.filter(p => p.status === 'Active').map((product) => (
              <div 
                key={product.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {product.icon ? (
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {typeof product.icon === 'string' ? (
                        <Image src={product.icon} alt={product.name} width={60} height={60} style={{ objectFit: 'cover' }} />
                      ) : (
                        product.icon
                      )}
                    </div>
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #B14CFF, #00E5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
                      {product.name.charAt(0)}
                    </div>
                  )}
                  
                  <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {product.status}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{product.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0, flex: 1, fontSize: '0.95rem' }}>{product.desc}</p>
                
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {product.price}
                  </span>
                  
                  <Link 
                    href={user ? product.href : "/dashboard"} 
                    {...(user && product.href.startsWith("http") ? { target: "_blank" } : {})}
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#fff', 
                      color: '#000', 
                      border: 'none', 
                      padding: '0.6rem 1.25rem', 
                      borderRadius: '99px', 
                      fontWeight: 600, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    Open App <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          {ecosystem.filter(p => p.status === 'In Development').length > 0 && (
            <>
              <div style={{ marginTop: '5rem', marginBottom: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Coming Soon</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '500px' }}>
                  Products currently in development at BX Labs.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', opacity: 0.7 }}>
                {ecosystem.filter(p => p.status === 'In Development').map((product) => (
                  <div
                    key={product.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '24px',
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {product.icon ? (
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {typeof product.icon === 'string' ? (
                            <Image src={product.icon} alt={product.name} width={60} height={60} style={{ objectFit: 'cover' }} />
                          ) : (
                            product.icon
                          )}
                        </div>
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #B14CFF, #00E5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
                          {product.name.charAt(0)}
                        </div>
                      )}
                      <span style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        In Development
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{product.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0, flex: 1, fontSize: '0.95rem' }}>{product.desc}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.9rem', color: '#7B2DFF', fontWeight: 600 }}>Launching soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
