import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { RazorpayModal } from '../components/RazorpayModal.jsx';

export const CartPage = () => {
  const {
    cartData,
    handleUpdateQuantity,
    handleDeleteCartItem,
    setCurrentRoute
  } = useApp();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const items = cartData.products || [];
  const subtotal = cartData.overall_total_price || 0;
  const shippingCost = items.length > 0 ? 370.00 : 0.00;
  const grandTotal = subtotal + shippingCost;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
      
      {/* Title & Navigation Breadcrumb */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Shopping Bag</h1>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {items.length} unique item{items.length === 1 ? '' : 's'} in your bag
          </span>
        </div>

        <button 
          onClick={() => setCurrentRoute('home')}
          className="btn-secondary"
          style={{ fontSize: 13, padding: '8px 16px' }}
        >
          ← Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div 
          className="glass-panel" 
          style={{ textAlign: 'center', padding: '80px 20px', borderRadius: 20 }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
            Looks like you haven't added anything to your cart yet. Explore our latest luxury catalog to discover something exceptional.
          </p>
          <button 
            onClick={() => setCurrentRoute('home')}
            className="btn-primary"
            style={{ padding: '12px 28px' }}
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        /* Active Cart Layout */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item) => (
              <div 
                key={item.product_id}
                className="glass-panel"
                style={{
                  padding: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  transition: 'var(--transition-fast)'
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#0D1322',
                  flexShrink: 0
                }}>
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Unit Price: ₹{Number(item.price_per_unit).toFixed(2)}
                  </div>
                  
                  {/* Quantity Counter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 700
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 8px', fontSize: 13, fontWeight: 700, color: '#FFF' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 700
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteCartItem(item.product_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                    ₹{Number(item.total_price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div 
            className="glass-panel"
            style={{
              padding: 24,
              borderRadius: 20,
              border: '1px solid rgba(245, 158, 11, 0.2)',
              position: 'sticky',
              top: 130
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Order Summary</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Standard Shipping</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{shippingCost.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tax &amp; Duties (GST)</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Included</span>
            </div>

            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 16,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Grand Total</span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>Including all taxes</span>
              </div>
              <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 12
              }}
            >
              🔒 Proceed to Checkout
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--text-muted)' }}>
              ⚡ Powered by Razorpay 256-bit Secure Encryption
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Simulation Modal */}
      <RazorpayModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        totalAmount={grandTotal}
        cartItems={items}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
          setCurrentRoute('orders');
        }}
      />
    </div>
  );
};
