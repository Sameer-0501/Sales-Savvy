import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const RegisterPage = () => {
  const { handleRegister, setCurrentRoute } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password validation checks matching Topic 3 specifications
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$]/.test(password);

  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (username.length < 5 || username.length > 50) {
      setErrorMsg('Username must be between 5 and 50 characters.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 chars with uppercase, lowercase, number, and special character (@, #, $).');
      return;
    }

    setIsSubmitting(true);
    const success = await handleRegister(username, email, password, role);
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Registration failed. Username or email may already be in use.');
    }
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
          maxWidth: 480,
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
            ✨
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFF' }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Join the Sales Savvy luxury commerce experience
          </p>
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
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Username (5-50 characters)
            </label>
            <input
              type="text"
              placeholder="e.g. alexander"
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
                outline: 'none'
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Account Role
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['CUSTOMER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: role === r ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: role === r ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: role === r ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {r === 'CUSTOMER' ? '👤 Customer' : '⚙️ Administrator'}
                </button>
              ))}
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min 8 chars with A-Z, a-z, 0-9, @#$"
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
                outline: 'none'
              }}
            />

            {/* Micro Validation Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {[
                { label: '8+ chars', met: hasMinLength },
                { label: 'Uppercase (A-Z)', met: hasUpper },
                { label: 'Lowercase (a-z)', met: hasLower },
                { label: 'Number (0-9)', met: hasNumber },
                { label: 'Special (@,#,$)', met: hasSpecial }
              ].map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: c.met ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: c.met ? '#34D399' : 'var(--text-muted)',
                    border: c.met ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                  }}
                >
                  {c.met ? '✓ ' : '○ '}{c.label}
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
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
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span 
            onClick={() => setCurrentRoute('login')}
            style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};
