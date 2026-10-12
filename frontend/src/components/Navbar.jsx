import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const Navbar = () => {
  const {
    user,
    cartCount,
    setIsCartOpen,
    setCurrentRoute,
    currentRoute,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleLogout
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['All', 'Shirts', 'Pants', 'Accessories', 'Mobiles', 'Mobile Accessories'];

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Navbar Row */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentRoute('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{ 
            width: 38, 
            height: 38, 
            borderRadius: 10, 
            background: 'var(--accent-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--glow-auric)',
            fontWeight: 800,
            fontSize: 20,
            color: '#090D16'
          }}>
            ⚡
          </div>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#FFF' }}>
              Sales<span style={{ color: 'var(--accent-primary)' }}>Savvy</span>
            </span>
            <span style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
              Luxe Marketplace
            </span>
          </div>
        </div>

        {/* Global Live Search */}
        <div style={{ flex: '1', maxWidth: 460, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search shirts, tech, luxury watches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              transition: 'var(--transition-fast)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>

        {/* Right Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Navigation Links */}
          <button 
            onClick={() => setCurrentRoute('home')}
            style={{
              background: 'none',
              border: 'none',
              color: currentRoute === 'home' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Catalog
          </button>

          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setCurrentRoute('admin')}
              style={{
                background: currentRoute === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#818CF8',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13
              }}
            >
              ⚙️ Admin Panel
            </button>
          )}

          {/* Cart Icon with Live Badge */}
          <div 
            onClick={() => setCurrentRoute('cart')}
            style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <span style={{ fontSize: 18 }}>🛒</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--accent-gradient)',
                color: '#090D16',
                borderRadius: 'var(--radius-full)',
                padding: '2px 7px',
                fontSize: 11,
                fontWeight: 800,
                boxShadow: 'var(--glow-auric)'
              }}>
                {cartCount}
              </span>
            )}
          </div>

          {/* User Profile Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isDropdownOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: user.role === 'ADMIN' ? 'var(--indigo-gradient)' : 'linear-gradient(135deg, #059669, #10B981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#FFF'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</div>
                  <div style={{ fontSize: 10, color: user.role === 'ADMIN' ? '#818CF8' : 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {user.role}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 200,
                    padding: 8,
                    boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                    zIndex: 200
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Signed in as</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user.username}</div>
                  </div>

                  <button 
                    onClick={() => { setCurrentRoute('orders'); setIsDropdownOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    📦 My Orders
                  </button>

                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => { setCurrentRoute('admin'); setIsDropdownOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', fontSize: 13, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      ⚙️ Admin Dashboard
                    </button>
                  )}

                  <button 
                    onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, borderTop: '1px solid var(--border-subtle)' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => setCurrentRoute('login')} 
                className="btn-secondary" 
                style={{ padding: '6px 14px', fontSize: 13 }}
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentRoute('register')} 
                className="btn-primary" 
                style={{ padding: '6px 14px', fontSize: 13 }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Category Navigation Bar matching Topic 5 requirements */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(9, 13, 22, 0.4)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginRight: 8, fontWeight: 700 }}>
            Categories:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (currentRoute !== 'home') setCurrentRoute('home');
                }}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
