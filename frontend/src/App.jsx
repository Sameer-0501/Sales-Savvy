import React from 'react';
import { useApp } from './context/AppContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { CustomerHomePage } from './pages/CustomerHomePage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { OrderHistoryPage } from './pages/OrderHistoryPage.jsx';

export const App = () => {
  const { currentRoute, toast } = useApp();

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <CustomerHomePage />;
      case 'cart':
        return <CartPage />;
      case 'orders':
        return <OrderHistoryPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerHomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 99999,
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' :
                      toast.type === 'warning' ? 'rgba(245, 158, 11, 0.95)' :
                      toast.type === 'info' ? 'rgba(99, 102, 241, 0.95)' :
                      'rgba(16, 185, 129, 0.95)',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontWeight: 600,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Dynamic Page Content */}
      <main style={{ flex: 1 }}>
        {renderActiveRoute()}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
