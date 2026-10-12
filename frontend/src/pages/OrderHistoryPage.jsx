import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export const OrderHistoryPage = () => {
  const { orders, user, setCurrentRoute } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'SHIPPED':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' };
      case 'APPROVED':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'CANCELLED':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', text: 'var(--text-secondary)', border: 'var(--border-subtle)' };
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Purchase History &amp; Orders</h1>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing logged orders for account <strong>{user?.username}</strong>
          </span>
        </div>

        <button 
          onClick={() => setCurrentRoute('home')}
          className="btn-secondary"
          style={{ fontSize: 13 }}
        >
          ← Back to Catalog
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '70px 20px', borderRadius: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            When you complete purchases, your order receipts and delivery statuses will show up here.
          </p>
          <button 
            onClick={() => setCurrentRoute('home')}
            className="btn-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div 
                key={order.order_id}
                className="glass-panel"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {/* Order Top Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: 16,
                  marginBottom: 16
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ORDER NUMBER</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: '#FFF' }}>
                      {order.order_id}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PLACED ON</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      {order.date || 'Recent'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>STATUS</div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      ● {order.status}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>TOTAL PAID</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    Purchased Items:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(order.items || []).map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: 8,
                          fontSize: 13
                        }}
                      >
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {item.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>× {item.quantity}</span>
                        </span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                          ₹{Number(item.total_price || item.price_per_unit * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
