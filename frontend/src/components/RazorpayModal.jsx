import React, { useState } from 'react';
import { paymentService } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';

export const RazorpayModal = ({ isOpen, onClose, totalAmount, cartItems, onSuccess }) => {
  const { user, showToast, loadOrders } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  if (!isOpen) return null;

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    try {
      // Step 1: Create Order on backend/mock
      const orderRes = await paymentService.createRazorpayOrder(cartItems, totalAmount);
      
      // Simulate Razorpay secure processing delay (1.2 seconds)
      await new Promise(res => setTimeout(res, 1200));

      // Step 2: Verify Payment
      const paymentId = `pay_${Math.random().toString(36).substring(2, 10)}`;
      const signature = `sig_hmac_${Math.random().toString(36).substring(2, 12)}`;

      const verifyRes = await paymentService.verifyPayment(
        orderRes.razorpayOrderId,
        paymentId,
        signature,
        {
          username: user.username,
          items: cartItems,
          totalAmount: totalAmount
        }
      );

      setPaymentDetails({
        orderId: orderRes.razorpayOrderId,
        paymentId: paymentId,
        amount: totalAmount
      });

      setIsCompleted(true);
      await loadOrders();
      showToast('Payment successful! Order confirmed.', 'success');
    } catch (err) {
      showToast('Payment failed. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setIsCompleted(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 20
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#0B1120',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          borderRadius: 20,
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Razorpay Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #0C2340 0%, #061122 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              background: '#0284C7',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 18
            }}>
              ₹
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Razorpay Checkout</div>
              <div style={{ fontSize: 11, color: '#38BDF8', letterSpacing: '0.04em' }}>TEST MODE • SECURE 256-BIT</div>
            </div>
          </div>

          {!isProcessing && !isCompleted && (
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px' }}>
          {!isCompleted ? (
            <>
              {/* Amount Display */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                padding: '16px',
                textAlign: 'center',
                marginBottom: 20,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Payable Total
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{Number(totalAmount).toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Paying as: <strong>{user?.username || 'Customer'}</strong>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Select Payment Method:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'upi', name: 'Instant UPI / QR', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
                    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { id: 'netbanking', name: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis', icon: '🏦' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: selectedMethod === m.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: selectedMethod === m.id ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{m.icon}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.desc}</div>
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        name="method" 
                        checked={selectedMethod === m.id} 
                        onChange={() => setSelectedMethod(m.id)}
                        style={{ accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleSimulatedPayment}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 10,
                  background: isProcessing ? 'var(--bg-tertiary)' : 'var(--accent-gradient)',
                  color: '#090D16',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 700,
                  border: 'none',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: 'var(--glow-auric)'
                }}
              >
                {isProcessing ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                    <span>Verifying with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{Number(totalAmount).toFixed(2)} Securely</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Payment Success Screen */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 64,
                height: 64,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 32,
                color: '#10B981'
              }}>
                ✓
              </div>

              <h2 style={{ fontSize: 22, color: '#FFF', marginBottom: 8 }}>Payment Verified!</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Thank you. Your transaction has been securely captured and the cart cleared.
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                padding: '14px',
                textAlign: 'left',
                fontSize: 13,
                marginBottom: 24,
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{paymentDetails?.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Ref:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{paymentDetails?.paymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>₹{paymentDetails?.amount?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                View My Orders
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
