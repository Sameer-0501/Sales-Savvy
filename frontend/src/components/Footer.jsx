import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.9)',
      padding: '48px 24px 32px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 36,
          marginBottom: 40
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#090D16',
                fontWeight: 800
              }}>
                ⚡
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }}>
                Sales<span style={{ color: 'var(--accent-primary)' }}>Savvy</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Your flagship online destination for bespoke fashion, precision timepieces, and flagship personal technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <li><span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Bespoke Shirts &amp; Apparel</span></li>
              <li><span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Chinos &amp; Selvedge Denim</span></li>
              <li><span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Watches &amp; Leathercraft</span></li>
              <li><span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Smartphones &amp; Audio</span></li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Engineering
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <li style={{ color: 'var(--text-muted)' }}>🔒 256-Bit SSL / TLS Encryption</li>
              <li style={{ color: 'var(--text-muted)' }}>⚡ Java Spring Boot Microservices</li>
              <li style={{ color: 'var(--text-muted)' }}>💳 Razorpay Sandbox Payment</li>
              <li style={{ color: 'var(--text-muted)' }}>🛡️ BCrypt &amp; JWT Token Guard</li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: 'var(--text-muted)'
        }}>
          <div>© 2026 SalesSavvy Platform Inc. All rights reserved.</div>
          <div>Crafted with precision &amp; modern luxury aesthetics.</div>
        </div>
      </div>
    </footer>
  );
};
