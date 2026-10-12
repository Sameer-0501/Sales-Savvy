import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const LoginPage = () => {
  const { handleLogin, setCurrentRoute } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    const success = await handleLogin(username, password);
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Invalid username or password.');
    }
  };

  const handleQuickFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 180px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 36px',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: 'var(--glow-auric)',
            marginBottom: 16,
            color: '#090D16'
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFF' }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Sign in to access your Sales Savvy account
          </p>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 24
        }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            ⚡ 1-Click Demo Login:
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickFill('div', 'password123')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              👤 Customer (div)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'password123')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818CF8',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚙️ Admin (admin)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 20
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. div or admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                fontSize: 14,
                outline: 'none',
                transition: 'var(--transition-fast)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                fontSize: 14,
                outline: 'none',
                transition: 'var(--transition-fast)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              justifyContent: 'center',
              fontSize: 15,
              borderRadius: 10
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span 
            onClick={() => setCurrentRoute('register')}
            style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create one here
          </span>
        </div>
      </div>
    </div>
  );
};
